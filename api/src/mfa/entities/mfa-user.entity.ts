import { Entity } from 'dynamodb-toolbox';
import { MfaTable } from './table';

export const MfaUser = new Entity({
  name: 'MfaUser',
  table: MfaTable,
  attributes: {
    id: { partitionKey: true },
    sk: { hidden: true, sortKey: true },
    identifierType: ['sk', 0],
    identifier: ['sk', 1],
    secret: { type: 'string' },
    verified: { type: 'boolean', default: false },
    enabled: { type: 'boolean', default: false },
    date_added: { type: 'string' },
    date_verified: { type: 'string' },
    date_disabled: { type: 'string' },
  },
} as const);

export const MfaRequest = new Entity({
  name: 'MfaRequest',
  table: MfaTable,
  attributes: {
    id: { partitionKey: true },
    sk: { hidden: true, sortKey: true },
    identifierType: ['sk', 0],
    identifier: ['sk', 1],
    date_added: ['sk', 2],
    verified: { type: 'boolean', default: false },
    date_verified: { type: 'string' },
  },
} as const);
