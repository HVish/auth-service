import { randomBytes } from 'crypto';

export function generateId(prefix?: string) {
  if (!prefix) return randomBytes(64).toString('base64url');
  return `${prefix}.${randomBytes(64).toString('base64url')}`;
}
