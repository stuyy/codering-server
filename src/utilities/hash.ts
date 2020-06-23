import { config } from 'dotenv';
import crypto from 'crypto';

config();

const { SECRET_KEY, ALGORITHM } = process.env;

export function computeHash(body: Buffer, algorithm: string, secret: string) {
  const hmac = crypto.createHmac(algorithm, secret);
  hmac.update(body);
  const hash = hmac.digest('hex');
  return hash;
}

export function encryptToken(token: string): string {
  if (SECRET_KEY && ALGORITHM) {
    const key = crypto.scryptSync(SECRET_KEY, 'salt', 24);
    const iv = Buffer.alloc(16);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const encrypted = cipher.update(token, 'utf8', 'base64');
    return encrypted + cipher.final('base64');
  } throw new Error('Failed to encrypt token. No secret key or algorithm specified.');
}

export function decryptToken(token: string): string {
  if (SECRET_KEY && ALGORITHM) {
    const key = crypto.scryptSync(SECRET_KEY, 'salt', 24);
    const iv = Buffer.alloc(16);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    const decrypted = decipher.update(token, 'base64', 'utf8');
    return decrypted + decipher.final();
  } throw new Error('Failed to encrypt token. No secret key or algorithm specified.');
}