import crypto from 'crypto';

export function computeHash(body: Buffer, algorithm: string, secret: string) {
  const hmac = crypto.createHmac(algorithm, secret);
  hmac.update(body);
  const hash = hmac.digest('hex');
  return hash;
}