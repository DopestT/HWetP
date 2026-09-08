import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;
const [sourceId, action, ...reasonParts] = process.argv.slice(2);
const actor = (process.env.MODERATOR_ACTOR || '').trim();
const reason = reasonParts.join(' ').trim();

if (!sourceId || !action || !reason) {
  console.error('Usage: MODERATOR_ACTOR="name" node scripts/moderate-source.js <sourceId> <approve|revoke|reopen> <reason>');
  process.exit(1);
}

if (!actor) {
  console.error('MODERATOR_ACTOR is required so every moderation action is attributable.');
  process.exit(1);
}

if (!['approve', 'revoke', 'reopen'].includes(action)) {
  console.error('Invalid action. Use approve, revoke, or reopen.');
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const client = await pool.connect();

try {
  await client.query('BEGIN');

  const result = await client.query(
    `SELECT id, name, source_type, base_url, allowed_media_hosts,
            authorization_status, authorization_reference, terms_reviewed_at,
            approved_at, approved_by, revoked_at
       FROM content_sources
      WHERE id = $1
      FOR UPDATE`,
    [sourceId],
  );

  if (!result.rowCount) throw new Error('Source not found.');
  const source = result.rows[0];
  const previousState = { ...source };

  if (action === 'approve') {
    if (source.authorization_status !== 'pending') {
      throw new Error(`Only pending sources can be approved. Current status: ${source.authorization_status}.`);
    }
    if (!source.authorization_reference) {
      throw new Error('Source cannot be approved without authorization_reference evidence.');
    }
    if (!Array.isArray(source.allowed_media_hosts) || !source.allowed_media_hosts.length) {
      throw new Error('Source cannot be approved without at least one allowed media host.');
    }

    await client.query(
      `UPDATE content_sources
          SET authorization_status = 'approved',
              terms_reviewed_at = now(),
              approved_at = now(),
              approved_by = $2,
              revoked_at = NULL
        WHERE id = $1`,
      [sourceId, actor],
    );
  }

  if (action === 'revoke') {
    if (source.authorization_status !== 'approved') {
      throw new Error(`Only approved sources can be revoked. Current status: ${source.authorization_status}.`);
    }
    await client.query(
      `UPDATE content_sources
          SET authorization_status = 'revoked',
              revoked_at = now()
        WHERE id = $1`,
      [sourceId],
    );
  }

  if (action === 'reopen') {
    if (source.authorization_status !== 'revoked') {
      throw new Error(`Only revoked sources can be reopened for review. Current status: ${source.authorization_status}.`);
    }
    await client.query(
      `UPDATE content_sources
          SET authorization_status = 'pending',
              approved_at = NULL,
              approved_by = NULL,
              revoked_at = NULL
        WHERE id = $1`,
      [sourceId],
    );
  }

  const updated = await client.query(
    `SELECT id, name, source_type, base_url, allowed_media_hosts,
            authorization_status, authorization_reference, terms_reviewed_at,
            approved_at, approved_by, revoked_at, updated_at
       FROM content_sources
      WHERE id = $1`,
    [sourceId],
  );
  const newState = updated.rows[0];

  await client.query(
    `INSERT INTO moderation_actions
      (actor, action_type, target_type, target_id, reason, previous_state, new_state)
     VALUES ($1, $2, 'source', $3, $4, $5::jsonb, $6::jsonb)`,
    [actor, `source.${action}`, sourceId, reason, JSON.stringify(previousState), JSON.stringify(newState)],
  );

  await client.query('COMMIT');
  console.log(JSON.stringify(newState, null, 2));
  console.error(`Recorded audited moderation action source.${action} by ${actor}.`);
} catch (error) {
  await client.query('ROLLBACK');
  console.error(error.message);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
