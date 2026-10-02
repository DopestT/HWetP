import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;
const [mode = 'all', limitArg = '25'] = process.argv.slice(2);
const limit = Math.min(Math.max(Number.parseInt(limitArg, 10) || 25, 1), 100);

if (!['all', 'sources', 'videos', 'audit'].includes(mode)) {
  console.error('Usage: node scripts/moderation-queue.js [all|sources|videos|audit] [limit]');
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
try {
  const output = {};

  if (mode === 'all' || mode === 'sources') {
    const sources = await pool.query(
      `SELECT id, name, source_type, base_url, allowed_media_hosts,
              authorization_status, authorization_reference, created_at, updated_at
         FROM content_sources
        WHERE authorization_status = 'pending'
        ORDER BY created_at ASC
        LIMIT $1`,
      [limit],
    );
    output.pendingSources = sources.rows;
  }

  if (mode === 'all' || mode === 'videos') {
    const videos = await pool.query(
      `SELECT v.id, v.slug, v.title, v.media_mode, v.consent_reference,
              v.rights_reference, v.moderation_status, v.created_at,
              s.id AS source_id, s.name AS source_name,
              s.authorization_status AS source_authorization_status
         FROM videos v
         JOIN content_sources s ON s.id = v.source_id
        WHERE v.moderation_status = 'pending'
        ORDER BY v.created_at ASC
        LIMIT $1`,
      [limit],
    );
    output.pendingVideos = videos.rows;
  }

  if (mode === 'all' || mode === 'audit') {
    const audit = await pool.query(
      `SELECT id, actor, action_type, target_type, target_id, reason, created_at
         FROM moderation_actions
        ORDER BY created_at DESC
        LIMIT $1`,
      [limit],
    );
    output.recentActions = audit.rows;
  }

  console.log(JSON.stringify(output, null, 2));
} finally {
  await pool.end();
}
