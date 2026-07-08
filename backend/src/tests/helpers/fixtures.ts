import type { CreateLogInput } from '../../types/log.js';

export function generateMockPayload(override?: Partial<CreateLogInput>): CreateLogInput {
  return {
    actor: 'test-actor',
    action: 'TEST_ACTION',
    payload: { testKey: 'testValue' },
    ...override,
  };
}
