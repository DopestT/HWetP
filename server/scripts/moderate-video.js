import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;
const [videoId, action, ...reasonParts] = process.argv.slice(2);
const actor = (process.env.MODERATOR_ACTOR || '').trim();
const reason = reasonParts.join(' ').trim();

if (!videoId || !action || !reason) {
  console.error('Usage: MODERATOR_ACTOR="name" node scripts/moderate-video.js <videoId> <approve|reject|block|reopen> <reason>');
  process.exit(1);
}

if (!actor) {
  console.error('MODERATOR_ACTOR is required so every moderation action is attributable.');
  process.exit(1);
}

if (!['approve', 'reject', 'block', 'reopen'].includes(action)) {
  console.error('Invalid action. Use approve, reject, block, or reopen.');
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const client = await pool.connect();

try {
  await client.query('BEGIN');

  const result = await client.query(
    `SELECT v.id, v.source_id, v.external_id, v.slug, v.title, v.media_mode,
            v.media_url, v.thumbnail_url, v.consent_reference, v.rights_reference,
            v.attribution_text, v.moderation_status, v.is_removed, v.removal_reason,
            v.moderated_at, v.moderated_by,
            s.authorization_status AS source_authorization_status,
            s.name AS source_name
       FROM videos v
       JOIN content_sources s ON s.id = v.source_id
      WHERE v.id = $1
      FOR UPDATE OF v`,
    [videoId],
  );

  if (!result.rowCount) throw new Error('Video not found.');
  const video = result.rows[0];
  const previousState = { ...video };

  if (action === 'approve') {
    if (video.moderation_status !== 'pending') {
      throw new Error(`Only pending videos can be approved. Current status: ${video.moderation_status}.`);
    }
    if (video.source_authorization_status !== 'approved') {
      throw new Error(`Source must be approved before video approval. Current source status: ${video.source_authorization_status}.`);
    }
    if (!video.consent_reference) {
      throw new Error('Video cannot be approved without consent_reference evidence.');
    }
    if (!video.rights_reference) {
      throw new Error('Video cannot be approved without rights_reference evidence.');
    }

    await client.query(
      `UPDATE videos
          SET moderation_status = 'approved',
              is_removed = false,
              removal_reason = NULL,
              moderated_at = now(),
              moderated_by = $2
        WHERE id = $1`,
      [videoId, actor],
    );
  }

  if (action === 'reject') {
    if (video.moderation_status !== 'pending') {
      throw new Error(`Only pending videos can be rejected. Current status: ${video.moderation_status}.`);
    }
    await client.query(
      `UPDATE videos
          SET moderation_status = 'rejected',
              is_removed = false,
              removal_reason = NULL,
              moderated_at = now(),
              moderated_by = $2
        WHERE id = $1`,
      [videoId, actor],
    );
  }

  if (action === 'block') {
    if (video.moderation_status === 'blocked' && video.is_removed) {
      throw new Error('Video is already blocked.');
    }
    await client.query(
      `UPDATE videos
          SET moderation_status = 'blocked',
              is_removed = true,
              removal_reason = $3,
              moderated_at = now(),
              moderated_by = $2
        WHERE id = $1`,
      [videoId, actor, reason],
    );
  }

  if (action === 'reopen') {
    if (!['rejected', 'blocked'].includes(video.moderation_status)) {
      throw new Error(`Only rejected or blocked videos can be reopened. Current status: ${video.moderation_status}.`);
    }
    await client.query(
      `UPDATE videos
          SET moderation_status = 'pending',
              is_removed = false,
              removal_reason = NULL,
              moderated_at = now(),
              moderated_by = $2
        WHERE id = $1`,
      [videoId, actor],
    );
  }

  const updated = await client.query(
    `SELECT v.id, v.source_id, v.external_id, v.slug, v.title, v.media_mode,
            v.media_url, v.thumbnail_url, v.consent_reference, v.rights_reference,
            v.attribution_text, v.moderation_status, v.is_removed, v.removal_reason,
            v.moderated_at, v.moderated_by,
            s.authorization_status AS source_authorization_status,
            s.name AS source_name
       FROM videos v
       JOIN content_sources s ON s.id = v.source_id
      WHERE v.id = $1`,
    [videoId],
  );
  const newState = updated.rows[0];

  await client.query(
    `INSERT INTO moderation_actions
      (actor, action_type, target_type, target_id, reason, previous_state, new_state)
     VALUES ($1, $2, 'video', $3, $4, $5::jsonb, $6::jsonb)`,
    [actor, `video.${action}`, videoId, reason, JSON.stringify(previousState), JSON.stringify(newState)],
  );

  await client.query('COMMIT');
  console.log(JSON.stringify(newState, null, 2));
  console.error(`Recorded audited moderation action video.${action} by ${actor}.`);
} catch (error) {
  await client.query('ROLLBACK');
  console.error(error.message);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
