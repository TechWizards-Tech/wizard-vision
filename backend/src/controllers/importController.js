const multer = require('multer');
const XLSX = require('xlsx');
const prisma = require('../utils/prisma');

/**
 * Controller de Importação de Dados
 * Pattern: Service Layer + Strategy
 * Responsável por: parse do xlsx, mapeamento e persistência
 */

// Multer: armazena o arquivo na memória para processar
const upload = multer({ storage: multer.memoryStorage() });

/**
 * Mapeia uma linha do xlsx para o formato do banco
 */
const mapRowToSession = (row, athleteDbId) => {
  const parseDate = (val) => {
    if (!val) return null;
    if (val instanceof Date) return val;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  };

  return {
    athleteId: athleteDbId,
    startDate: parseDate(row['Start Date']) || new Date(),
    startTime: row['Start Time'] ? String(row['Start Time']) : null,
    endTime: row['End Time (s)'] ? String(row['End Time (s)']) : null,
    weekStartDate: parseDate(row['Week Start Date']),
    monthStartDate: parseDate(row['Month Start Date']),
    segmentName: row['Segment Name'] || 'Unknown',
    durationMins: row['Duration (mins)'] !== undefined ? Number(row['Duration (mins)']) : null,
    sessionLoad: row['Session Load'] !== undefined ? Number(row['Session Load']) : null,
    workload: row['Workload'] !== undefined ? Number(row['Workload']) : null,
    workloadVolume: row['Workload Volume'] !== undefined ? Number(row['Workload Volume']) : null,
    workloadIntensity: row['Workload Intensity'] !== undefined ? Number(row['Workload Intensity']) : null,
    distanceM: row['Distance (m)'] !== undefined ? Number(row['Distance (m)']) : null,
    metresPerMinute: row['Metres per Minute (m)'] !== undefined ? Number(row['Metres per Minute (m)']) : null,
    highIntensityRunM: row['High Intensity Running (m)'] !== undefined ? Number(row['High Intensity Running (m)']) : null,
    noHighIntensityEv: row['No. of High Intensity Events'] !== undefined ? Number(row['No. of High Intensity Events']) : null,
    sprintDistanceM: row['Sprint Distance (m)'] !== undefined ? Number(row['Sprint Distance (m)']) : null,
    rawTopSpeedKph: row['Raw Top Speed (kph)'] !== undefined ? Number(row['Raw Top Speed (kph)']) : null,
    noOfSprints: row['No. of Sprints'] !== undefined ? Number(row['No. of Sprints']) : null,
    topSpeedKph: row['Top Speed (kph)'] !== undefined ? Number(row['Top Speed (kph)']) : null,
    avgSpeedKph: row['Avg Speed (kph)'] !== undefined ? Number(row['Avg Speed (kph)']) : null,
    accelerations: row['Accelerations'] !== undefined ? Number(row['Accelerations']) : null,
    decelerations: row['Decelerations'] !== undefined ? Number(row['Decelerations']) : null,
    pctMaxSpeed: row['Percentage of Max Speed'] !== undefined ? Number(row['Percentage of Max Speed']) : null,
    pctRawMaxSpeed: row['Percentage of Raw Max Speed KPH'] !== undefined ? Number(row['Percentage of Raw Max Speed KPH']) : null,
  };
};

/**
 * Classifica perfil do atleta com base nas médias (regras simples — Sprint 1)
 * Sprint 2: substituir por ML (K-Means)
 */
const classifyProfile = (sessions) => {
  if (!sessions.length) return null;
  const wholeSessions = sessions.filter(s => s.segmentName === 'Whole Session');
  if (!wholeSessions.length) return null;

  const avgTopSpeed = wholeSessions.reduce((s, r) => s + (r.rawTopSpeedKph || 0), 0) / wholeSessions.length;
  const avgDistance = wholeSessions.reduce((s, r) => s + (r.distanceM || 0), 0) / wholeSessions.length;
  const avgSprints = wholeSessions.reduce((s, r) => s + (r.noOfSprints || 0), 0) / wholeSessions.length;
  const avgLoad = wholeSessions.reduce((s, r) => s + (r.sessionLoad || 0), 0) / wholeSessions.length;

  if (avgTopSpeed >= 30 && avgSprints >= 8) return 'explosivo';
  if (avgDistance >= 8000 && avgLoad >= 500) return 'alta_resistencia';
  if (avgLoad >= 700) return 'alta_carga_impacto';
  return 'baixa_intensidade';
};

// POST /import/xlsx
const importXlsx = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Arquivo xlsx não fornecido',
    });
  }

  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer', cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: undefined });

    if (!rows.length) {
      return res.status(400).json({ success: false, message: 'Arquivo vazio' });
    }

    // Agrupa por atleta
    const athleteMap = new Map();
    for (const row of rows) {
      const athleteId = row['Athlete ID'];
      if (!athleteId) continue;

      const key = String(athleteId);
      if (!athleteMap.has(key)) {
        athleteMap.set(key, {
          athleteId: BigInt(athleteId),
          position: row['Athlete Position'] || null,
          group: row['Athlete Groups'] || null,
          rows: [],
        });
      }
      athleteMap.get(key).rows.push(row);
    }

    let athletesCreated = 0;
    let sessionsCreated = 0;

    for (const [, athleteData] of athleteMap) {
      // Upsert atleta
      const athlete = await prisma.athlete.upsert({
        where: { athleteId: athleteData.athleteId },
        update: {
          position: athleteData.position,
          group: athleteData.group,
        },
        create: {
          athleteId: athleteData.athleteId,
          position: athleteData.position,
          group: athleteData.group,
        },
      });

      // Cria sessões em batch
      const sessionData = athleteData.rows.map(row => mapRowToSession(row, athlete.id));

      await prisma.session.createMany({
        data: sessionData,
        skipDuplicates: false,
      });

      // Classifica perfil
      const profile = classifyProfile(sessionData);
      if (profile) {
        await prisma.athlete.update({
          where: { id: athlete.id },
          data: { profile },
        });
      }

      athletesCreated++;
      sessionsCreated += sessionData.length;
    }

    // 🤖 Dispara o recálculo do modelo de IA (K-Means e detecção de anomalias no Python)
    try {
      const mlUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
      await fetch(`${mlUrl}/ml/recalculate-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('🤖 Inteligência Artificial (K-Means e Anomalias) recalculada com sucesso.');
    } catch (mlError) {
      console.warn('⚠️ Não foi possível conectar ao serviço de IA (ml_service). Ignorando para fins de teste local:', mlError.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Importação concluída com sucesso',
      data: {
        athletesProcessed: athletesCreated,
        sessionsImported: sessionsCreated,
      },
    });
  } catch (error) {
    console.error('Erro na importação:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao processar o arquivo',
      error: error.message,
    });
  }
};

/**
 * Controller para disparar o recálculo da IA manualmente
 */
const recalculateMl = async (req, res) => {
  try {
    const mlUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
    const response = await fetch(`${mlUrl}/ml/recalculate-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`Serviço de IA retornou status ${response.status}`);
    }
    
    const result = await response.json();
    return res.status(200).json({
      success: true,
      message: 'Inteligência artificial recalculada com sucesso no banco de dados',
      data: result
    });
  } catch (error) {
    console.error('Erro ao recalcular IA:', error);
    return res.status(500).json({
      success: false,
      message: 'Falha ao recalcular a Inteligência Artificial',
      error: error.message
    });
  }
};

module.exports = { upload, importXlsx, recalculateMl };
