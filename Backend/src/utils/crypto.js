import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

// Obtain the key from the environment variable. It should be a 32-character (256-bit) string.
const getEncryptionKey = () => {
  const secret = process.env.CREDENTIALS_ENCRYPTION_KEY;
  if (!secret) {
    throw new Error('CREDENTIALS_ENCRYPTION_KEY is not defined in the environment variables.');
  }
  // Generate a 32-byte key from the secret string
  return crypto.scryptSync(secret, 'codion-salt', 32);
};

/**
 * Encrypts a plain-text string using AES-256-GCM
 * @param {string} text 
 * @returns {string} Encrypted text formatted as iv:authTag:encryptedContent
 */
export function encrypt(text) {
  if (!text) return null;
  const iv = crypto.randomBytes(12);
  const key = getEncryptionKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts an encrypted string using AES-256-GCM
 * @param {string} encryptedText - Formatted as iv:authTag:encryptedContent
 * @returns {string} Plain-text string
 */
export function decrypt(encryptedText) {
  if (!encryptedText) return null;
  const parts = encryptedText.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted text format. Expected iv:authTag:encryptedContent');
  }
  
  const [ivHex, authTagHex, encrypted] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const key = getEncryptionKey();
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
