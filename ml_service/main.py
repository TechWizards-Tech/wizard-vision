import os
import psycopg2
from psycopg2.extras import RealDictCursor
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.ensemble import IsolationForest
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="WizardVision ML Service",
    description="Serviço de Inteligência Artificial para Classificação de Perfis e Detecção de Anomalias",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL:
    DATABASE_URL = DATABASE_URL.strip()

def get_db_connection():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"[ERROR] Erro ao conectar ao banco de dados: {e}")
        raise HTTPException(status_code=500, detail=f"Erro de conexão com o banco de dados: {str(e)}")

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "WizardVision ML Service",
        "timestamp": datetime.now().isoformat()
    }

class ProcessRequest(BaseModel):
    athlete_id: int = None

@app.post("/ml/train-profiles")
def train_profiles():
    """
    Treina o modelo K-Means para agrupar os atletas em 4 perfis físicos com base em dados históricos.
    Salva os perfis diretamente na tabela 'athletes'.
    """
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        # 1. Puxar médias históricas de 'Whole Session' para cada atleta
        query = """
            SELECT 
                "athleteId",
                AVG("distanceM") as avg_distance,
                AVG("topSpeedKph") as avg_speed,
                AVG("noOfSprints") as avg_sprints,
                AVG("sessionLoad") as avg_load
            FROM sessions
            WHERE "segmentName" = 'Whole Session'
            GROUP BY "athleteId"
            HAVING COUNT(id) >= 1
        """
        cursor.execute(query)
        rows = cursor.fetchall()
        
        if not rows:
            return {"success": False, "message": "Sem dados de sessões suficientes para treinar."}
        
        df = pd.DataFrame(rows)
        
        # Preencher NaNs com 0 para evitar quebras no KMeans
        df.fillna(0, inplace=True)
        
        # 2. Preparar as features para o K-Means
        features = ['avg_distance', 'avg_speed', 'avg_sprints', 'avg_load']
        X = df[features].values
        
        # Garantir número de clusters (máximo de atletas ou 4)
        n_clusters = min(4, len(df))
        if n_clusters < 2:
            # Se tiver muito poucos atletas, classifica manualmente
            for index, row in df.iterrows():
                profile = "baixa_intensidade"
                if row['avg_speed'] >= 28 or row['avg_sprints'] >= 6:
                    profile = "explosivo"
                elif row['avg_distance'] >= 7000:
                    profile = "alta_resistencia"
                
                cursor.execute(
                    'UPDATE athletes SET profile = %s WHERE id = %s',
                    (profile, int(row['athleteId']))
                )
            conn.commit()
            return {"success": True, "message": "Poucos atletas para K-Means. Classificados usando fallback heurístico."}
            
        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        df['cluster'] = kmeans.fit_predict(X)
        
        # 3. Rotular os clusters dinamicamente analisando os centroides
        centroids = kmeans.cluster_centers_
        
        # Mapeando os clusters baseados em suas características físicas
        cluster_labels = {}
        
        # Encontra o cluster explosivo (maior velocidade máxima média ou mais sprints)
        speed_idx = features.index('avg_speed')
        sprint_idx = features.index('avg_sprints')
        explosive_cluster = int(np.argmax(centroids[:, speed_idx] * 0.5 + centroids[:, sprint_idx] * 0.5))
        cluster_labels[explosive_cluster] = "explosivo"
        
        # Encontra o cluster de alta resistência (maior distância média)
        dist_idx = features.index('avg_distance')
        remaining = [i for i in range(n_clusters) if i not in cluster_labels]
        if remaining:
            resistence_cluster = int(remaining[np.argmax([centroids[i, dist_idx] for i in remaining])])
            cluster_labels[resistence_cluster] = "alta_resistencia"
            
        # Encontra o cluster de alta carga/impacto (maior session load entre os restantes)
        load_idx = features.index('avg_load')
        remaining = [i for i in range(n_clusters) if i not in cluster_labels]
        if remaining:
            load_cluster = int(remaining[np.argmax([centroids[i, load_idx] for i in remaining])])
            cluster_labels[load_cluster] = "alta_carga_impacto"
            
        # O cluster que sobrou é de baixa intensidade
        remaining = [i for i in range(n_clusters) if i not in cluster_labels]
        for r in remaining:
            cluster_labels[r] = "baixa_intensidade"
            
        # 4. Atualizar no banco de dados os perfis de cada atleta
        updated_count = 0
        for index, row in df.iterrows():
            cluster_id = int(row['cluster'])
            profile = cluster_labels.get(cluster_id, "baixa_intensidade")
            athlete_db_id = int(row['athleteId'])
            
            cursor.execute(
                'UPDATE athletes SET profile = %s, "updatedAt" = NOW() WHERE id = %s',
                (profile, athlete_db_id)
            )
            updated_count += 1
            
        conn.commit()
        return {
            "success": True, 
            "message": f"K-Means treinado com sucesso! {updated_count} atletas classificados.",
            "cluster_mapping": {str(k): v for k, v in cluster_labels.items()}
        }
        
    except Exception as e:
        conn.rollback()
        print(f"[ERROR] Erro ao rodar K-Means: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.post("/ml/detect-anomalies")
def detect_anomalies(request: ProcessRequest = None):
    """
    Roda algoritmo de detecção de anomalias para os atletas.
    Verifica se a última sessão de cada atleta está significativamente abaixo de sua própria média histórica.
    Gera um Alert no banco de dados se uma queda de rendimento brusca for detectada.
    """
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    athlete_id = request.athlete_id if request else None
    
    try:
        # 1. Obter atletas a serem processados
        if athlete_id:
            cursor.execute('SELECT id, name FROM athletes WHERE id = %s', (athlete_id,))
        else:
            cursor.execute('SELECT id, name FROM athletes')
            
        athletes = cursor.fetchall()
        alerts_created = 0
        sessions_flagged = 0
        
        for athlete in athletes:
            ath_id = athlete['id']
            ath_name = athlete['name'] or f"Atleta #{ath_id}"
            
            # Puxar todas as sessões "Whole Session" do atleta ordenadas por data
            cursor.execute("""
                SELECT id, "distanceM", "topSpeedKph", "noOfSprints", "sessionLoad", "startDate", "durationMins", "metresPerMinute"
                FROM sessions
                WHERE "athleteId" = %s AND "segmentName" = 'Whole Session'
                ORDER BY "startDate" ASC
            """, (ath_id,))
            sessions = cursor.fetchall()
            
            # Precisamos de pelo menos 3 sessões históricas para criar uma baseline individual do Z-Score
            if len(sessions) < 3:
                continue
                
            df = pd.DataFrame(sessions)
            df.fillna(0, inplace=True)
            
            # Garantir que durationMins seja maior que zero para evitar divisão por zero
            df['durationMins'] = df['durationMins'].apply(lambda x: float(x) if x and float(x) > 0 else 1.0)
            
            # Calcular colunas de esforço por minuto (distância/metresPerMinute já vem pronto do banco)
            df['sprintsPerMinute'] = df['noOfSprints'] / df['durationMins']
            df['loadPerMinute'] = df['sessionLoad'] / df['durationMins']
            
            # A última sessão é a que queremos avaliar
            latest_session = df.iloc[-1]
            historical = df.iloc[:-1] # todas as anteriores para servir de baseline
            
            latest_id = int(latest_session['id'])
            
            # 3. Executar predição com o Isolation Forest se houver histórico suficiente (análise multivariada individual)
            is_if_anomaly = False
            if len(sessions) >= 15:
                try:
                    # Prepara os dados de treino específicos do atleta (histórico sem a última sessão)
                    X_athlete_hist = historical[['metresPerMinute', 'loadPerMinute', 'sprintsPerMinute']].values
                    
                    # Inicializa e treina o Isolation Forest individual
                    iso_model_athlete = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
                    iso_model_athlete.fit(X_athlete_hist)
                    
                    latest_dist_min = float(latest_session['metresPerMinute']) if latest_session['metresPerMinute'] is not None else 0.0
                    latest_load_min = float(latest_session['loadPerMinute']) if latest_session['loadPerMinute'] is not None else 0.0
                    latest_sprints_min = float(latest_session['sprintsPerMinute']) if latest_session['sprintsPerMinute'] is not None else 0.0
                    
                    # predict retorna -1 para outliers e 1 para normais
                    pred = iso_model_athlete.predict([[latest_dist_min, latest_load_min, latest_sprints_min]])
                    if pred[0] == -1:
                        is_if_anomaly = True
                except Exception as if_err:
                    print(f"[ERROR] Erro ao treinar Isolation Forest Individual para atleta {ath_name}: {if_err}")
            else:
                print(f"[INFO] Histórico insuficiente para Isolation Forest individual do atleta {ath_name} ({len(sessions)} sessões). Utilizando apenas Z-Score.")

            # 4. Avaliar queda em métricas chaves via Z-Score Individual (análise univariada normalizada)
            metrics_to_check = [
                ('metresPerMinute', 'ritmo de corrida', ' m/min'),
                ('loadPerMinute', 'carga de esforço por minuto', ' un/min'),
                ('sprintsPerMinute', 'frequência de sprints por minuto', ' sprints/min')
            ]
            
            anomalies = []
            max_drop_pct = 0
            
            for col, name_pt, unit in metrics_to_check:
                hist_mean = historical[col].mean() #media
                hist_std = historical[col].std() # desvio padrao
                val_actual = latest_session[col]
                
                # Se o desvio padrão for zero ou muito baixo, assumimos um mínimo razoável para evitar divisão por zero
                if hist_std < (hist_mean * 0.05):
                    hist_std = hist_mean * 0.1
                
                # Z-Score: quão longe o valor atual está da média histórica
                z_score = (val_actual - hist_mean) / hist_std if hist_std > 0 else 0
                
                # Calculo do percentual de queda
                drop_pct = ((hist_mean - val_actual) / hist_mean * 100) if hist_mean > 0 else 0
                
                # Se o valor atual for menor que a média e a queda for significativa
                # Um Z-Score menor que -1.5 E queda superior a 25%
                if z_score < -1.5 and drop_pct > 25:
                    anomalies.append({
                        "metric": name_pt,
                        "hist_mean": round(hist_mean, 1),
                        "actual": round(val_actual, 1),
                        "drop_pct": round(drop_pct, 1),
                        "unit": unit
                    })
                    if drop_pct > max_drop_pct:
                        max_drop_pct = drop_pct
            
            is_zscore_anomaly = len(anomalies) > 0
            
            # Lógica de Decisão Híbrida: gera alerta se Z-Score OU Isolation Forest detectarem
            if is_zscore_anomaly or is_if_anomaly:
                # 5. Criar mensagem humanizada em português explicando a anomalia conforme o método disparado
                if is_zscore_anomaly and is_if_anomaly:
                    desc_list = [
                        f"{a['metric']} caiu {a['drop_pct']}% (Média: {a['hist_mean']}{a['unit']} | Atual: {a['actual']}{a['unit']})"
                        for a in anomalies
                    ]
                    message = f"Queda brusca de desempenho e comportamento atípico detectados em {ath_name}: " + ", ".join(desc_list) + ". [Método: Híbrido (Z-Score & Isolation Forest Individual)]"
                    severity = 'CRITICAL'
                elif is_zscore_anomaly:
                    desc_list = [
                        f"{a['metric']} caiu {a['drop_pct']}% (Média: {a['hist_mean']}{a['unit']} | Atual: {a['actual']}{a['unit']})"
                        for a in anomalies
                    ]
                    message = f"Queda brusca de desempenho detectada em {ath_name}: " + ", ".join(desc_list) + ". [Método: Z-Score Individual]"
                    severity = 'HIGH' if max_drop_pct < 40 else 'CRITICAL'
                else:
                    # Disparou apenas o Isolation Forest (multivariado individual)
                    message = f"Comportamento físico atípico detectado em {ath_name} (correlação incomum observada entre distância, sprints e carga de impacto). [Método: Isolation Forest Individual]"
                    severity = 'HIGH'
                    max_drop_pct = 30.0 # Score padrão estimado de queda para gravação do anomalyScore
                
                # Checa se já existe um alerta idêntico recente não lido para evitar duplicados
                cursor.execute("""
                    SELECT id FROM alerts 
                    WHERE "athleteId" = %s AND message = %s AND "isRead" = false
                """, (ath_id, message))
                
                if not cursor.fetchone():
                    # Inserir Alerta no banco
                    cursor.execute("""
                        INSERT INTO alerts ("athleteId", type, message, severity, "isRead", "createdAt")
                        VALUES (%s, 'performance_drop', %s, %s, false, NOW())
                    """, (ath_id, message, severity))
                    alerts_created += 1
                
                # Atualizar a sessão sinalizando anomalia
                cursor.execute("""
                    UPDATE sessions 
                    SET "isAnomaly" = true, "anomalyScore" = %s 
                    WHERE id = %s
                """, (float(max_drop_pct / 100), latest_id))
                sessions_flagged += 1
                
        conn.commit()
        return {
            "success": True,
            "message": f"Detecção concluída. {sessions_flagged} sessões com queda/atipicidade detectada. {alerts_created} novos alertas criados."
        }
        
    except Exception as e:
        conn.rollback()
        print(f"[ERROR] Erro na detecção de anomalias: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

# Rota simplificada que roda os dois fluxos de inteligência em lote
@app.post("/ml/recalculate-all")
def recalculate_all(background_tasks: BackgroundTasks):
    """
    Roda o K-Means e depois roda a Detecção de Anomalias.
    Pode ser chamado de forma síncrona ou em background.
    """
    # Roda síncrono para garantir feedback imediato na importação
    res_kmeans = train_profiles()
    res_anomalies = detect_anomalies()
    
    return {
        "success": True,
        "message": "Recálculo de inteligência artificial concluído com sucesso!",
        "details": {
            "kmeans": res_kmeans,
            "anomalies": res_anomalies
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
