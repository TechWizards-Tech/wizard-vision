const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';

// Chave secreta de criptografia (deve ter exatamente 32 bytes de tamanho)
// Se não estiver definida no .env, usamos uma geração determinística segura como fallback
const rawKey = process.env.ENCRYPTION_KEY;
let KEY;
if (rawKey) {
  // Se for fornecida em hexadecimal de 64 caracteres (32 bytes)
  if (rawKey.length === 64 && /^[0-9a-fA-F]+$/.test(rawKey)) {
    KEY = Buffer.from(rawKey, 'hex');
  } else {
    // Caso contrário, gera uma chave hash SHA-256 a partir da string fornecida
    KEY = crypto.createHash('sha256').update(rawKey).digest();
  }
} else {
  // Fallback determinístico de desenvolvimento
  KEY = crypto.createHash('sha256').update('wizardvision_fallback_encryption_key_2026').digest();
}

/**
 * Criptografa um texto em repouso
 * Formato retornado: iv:authTag:ciphertext (em formato hexadecimal)
 */
function encrypt(text) {
  if (!text) return text;
  
  try {
    const iv = crypto.randomBytes(12); // Vetor de inicialização recomendado para GCM
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch (err) {
    console.error('Falha ao criptografar dado:', err);
    return text; // Fallback tolerante a falhas
  }
}

/**
 * Descriptografa um texto criptografado em repouso
 * Se o texto não estiver criptografado no formato iv:authTag:ciphertext, ele retorna o texto limpo (retrocompatibilidade)
 */
function decrypt(encryptedText) {
  if (!encryptedText) return encryptedText;
  
  const parts = encryptedText.split(':');
  // Formato AES-256-GCM contém exatamente 3 partes separadas por dois pontos (iv, authTag, cifra)
  if (parts.length !== 3) {
    return encryptedText;
  }
  
  try {
    const [ivHex, authTagHex, encryptedHex] = parts;
    
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (err) {
    // Caso falhe por ser texto plano legado ou chave diferente, retorna o próprio texto
    return encryptedText;
  }
}

module.exports = { encrypt, decrypt };
