import { config } from '../../config/env.js';

export function getAuthHeader() {
  return { 'X-API-Key': config.API_KEY };
}
