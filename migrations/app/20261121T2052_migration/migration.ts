#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/9e77fb88cd2eecdb15283239cfbd910347b3dc9376c9c05c2e658497c4764b5e/contract';
import endContract from '../../snapshots/9e77fb88cd2eecdb15283239cfbd910347b3dc9376c9c05c2e658497c4764b5e/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'registration_challenges',
        columns: [
          col('attempts', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('consumed_at', 'timestamptz(3)', {
            codecRef: {
              codecId: 'pg/timestamptz-date@1',
              typeParams: { precision: 3 },
            },
          }),
          col('expires_at', 'timestamptz(3)', {
            notNull: true,
            codecRef: {
              codecId: 'pg/timestamptz-date@1',
              typeParams: { precision: 3 },
            },
          }),
          col('id', 'uuid', {
            notNull: true,
            codecRef: { codecId: 'pg/uuid@1' },
          }),
          col('last_sent_at', 'timestamptz(3)', {
            notNull: true,
            codecRef: {
              codecId: 'pg/timestamptz-date@1',
              typeParams: { precision: 3 },
            },
          }),
          col('secret_hash', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('type', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('user_id', 'uuid', {
            notNull: true,
            codecRef: { codecId: 'pg/uuid@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'registration_challenge_attempts_range_d5e9f5f8',
            sql`attempts >= 0 AND attempts <= 5`,
          ),
          checkExpression(
            'registration_challenges_type_check_0ad1a5df',
            sql`"type" IN ('otp', 'magic_link')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'users',
        columns: [
          col('created_at', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: {
              codecId: 'pg/timestamptz-date@1',
              typeParams: { precision: 3 },
            },
          }),
          col('email', 'character varying(254)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 254 } },
          }),
          col('id', 'uuid', {
            notNull: true,
            codecRef: { codecId: 'pg/uuid@1' },
          }),
          col('password_hash', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('pending'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updated_at', 'timestamptz(3)', {
            notNull: true,
            codecRef: {
              codecId: 'pg/timestamptz-date@1',
              typeParams: { precision: 3 },
            },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'users_status_check_67ff51aa',
            sql`"status" IN ('pending', 'active')`,
          ),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'registration_challenges',
        constraint: 'registration_challenges_user_id_key',
        columns: ['user_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'users',
        constraint: 'users_email_key',
        columns: ['email'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'registration_challenges',
        foreignKey: {
          name: 'registration_challenges_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
