import crypto from 'crypto';
import type { JsonValue } from '../types/log.js';

/**
 * Deterministically serializes a JSON payload by sorting all keys recursively.
 */
export const serializePayload = (payload: JsonValue): string => {
  if (payload === null) {
    return 'null';
  }

  if (Array.isArray(payload)) {
    return '[' + payload.map((item) => serializePayload(item)).join(',') + ']';
  }

  if (typeof payload === 'object') {
    const obj = payload as Record<string, JsonValue>;
    const sortedKeys = Object.keys(obj).sort();
    const parts = sortedKeys
      .map((key) => {
        const val = obj[key];
        if (val === undefined) {
          return null;
        }
        return `${JSON.stringify(key)}:${serializePayload(val)}`;
      })
      .filter((part): part is string => part !== null);

    return '{' + parts.join(',') + '}';
  }

  return JSON.stringify(payload);
};

/**
 * Calculates a SHA-256 hash over the combined string representation of log parameters.
 * The output is guaranteed to be a 64-character lowercase hexadecimal string.
 */
export const computeLogHash = (
  previousHash: string,
  actor: string,
  action: string,
  serializedPayload: string,
  createdAt: string
): string => {
  const data = previousHash + actor + action + serializedPayload + createdAt;
  return crypto
    .createHash('sha256')
    .update(data)
    .digest('hex')
    .toLowerCase();
};
