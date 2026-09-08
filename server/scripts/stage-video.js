import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;
const [sourceId, externalId, slug, title, mediaMode, mediaUrl, thumbnailUrl = ''] = process.argv.slice(2);

if (!sourceId || !externalId || !slug || !title || !mediaMode || !mediaUrl) {
  console.error('Usage: node scripts/stage-video.js <sourceId> <externalId> <slug> <title> <embed|remote_stream|licensed_hosted> <mediaUrl> [thumbnailUrl]');
  process.exit(1);
}

if (!['embed', 'remote_stream', 'licensed_hosted'].includes(mediaMode)) {
  console.error('Invalid media mode.');
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
try {
  const source = await pool.query(
    'SELECT id, name, authorization_status FROM content_sources WHERE id = $1',
    [sourceId],
  );
  if (!source.rowCount) throw new Error('Source not found. Register the source first.');

  const result = await pool.query(
    `INSERT INTO videos
      (source_id, external_id, slug, title, media_mode, media_url, thumbnail_url, moderation_status)
     VALUES ($1, $2, $3, $4, $5, $6, NULLIF($7, ''), 'pending')
     ON CONFLICT (source_id, external_id) DO UPDATE SET
       slug = EXCLUDED.slug,
       title = EXCLUDED.title,
       media_mode = EXCLUDED.media_mode,
       media_url = EXCLUDED.media_url,
       thumbnail_url = EXCLUDED.thumbnail_url,
       moderation_status = 'pending',
       is_removed = false,
       removal_reason = NULL
     RETURNING id, slug, title, moderation_status, created_at, updated_at`,
    [sourceId, externalId, slug, title, mediaMode, mediaUrl, thumbnailUrl],
  );

  console.log(JSON.stringify({ source: source.rows[0], video: result.rows[0] }, null, 2));
  console.error('Video staged as PENDING moderation. It cannot appear publicly until the source and the video are both explicitly approved.');
} finally {
  await pool.end();
}
