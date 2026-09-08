import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;
const [
  sourceId,
  externalId,
  slug,
  title,
  mediaMode,
  mediaUrl,
  thumbnailUrl = '',
  consentReference = '',
  rightsReference = '',
  attributionText = '',
] = process.argv.slice(2);

if (!sourceId || !externalId || !slug || !title || !mediaMode || !mediaUrl) {
  console.error('Usage: node scripts/stage-video.js <sourceId> <externalId> <slug> <title> <embed|remote_stream|licensed_hosted> <mediaUrl> [thumbnailUrl] [consentReference] [rightsReference] [attributionText]');
  process.exit(1);
}

if (!['embed', 'remote_stream', 'licensed_hosted'].includes(mediaMode)) {
  console.error('Invalid media mode.');
  process.exit(1);
}

function validateRemoteUrl(value, allowedHosts, label) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${label} must be a valid URL.`);
  }

  if (parsed.protocol !== 'https:') {
    throw new Error(`${label} must use HTTPS.`);
  }

  const host = parsed.hostname.toLowerCase();
  const allowed = allowedHosts.some((allowedHost) => host === allowedHost || host.endsWith(`.${allowedHost}`));
  if (!allowed) {
    throw new Error(`${label} host ${host} is not on this source's allowed media-host list.`);
  }
  return parsed.toString();
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
try {
  const source = await pool.query(
    'SELECT id, name, authorization_status, allowed_media_hosts FROM content_sources WHERE id = $1',
    [sourceId],
  );
  if (!source.rowCount) throw new Error('Source not found. Register the source first.');

  const allowedHosts = source.rows[0].allowed_media_hosts || [];
  if (!allowedHosts.length) throw new Error('Source has no allowed media hosts. Re-register or update it before staging media.');

  const safeMediaUrl = validateRemoteUrl(mediaUrl, allowedHosts, 'mediaUrl');
  const safeThumbnailUrl = thumbnailUrl ? validateRemoteUrl(thumbnailUrl, allowedHosts, 'thumbnailUrl') : '';

  const result = await pool.query(
    `INSERT INTO videos
      (source_id, external_id, slug, title, media_mode, media_url, thumbnail_url,
       consent_reference, rights_reference, attribution_text, moderation_status)
     VALUES ($1, $2, $3, $4, $5, $6, NULLIF($7, ''), NULLIF($8, ''), NULLIF($9, ''), NULLIF($10, ''), 'pending')
     ON CONFLICT (source_id, external_id) DO UPDATE SET
       slug = EXCLUDED.slug,
       title = EXCLUDED.title,
       media_mode = EXCLUDED.media_mode,
       media_url = EXCLUDED.media_url,
       thumbnail_url = EXCLUDED.thumbnail_url,
       consent_reference = COALESCE(EXCLUDED.consent_reference, videos.consent_reference),
       rights_reference = COALESCE(EXCLUDED.rights_reference, videos.rights_reference),
       attribution_text = COALESCE(EXCLUDED.attribution_text, videos.attribution_text),
       moderation_status = 'pending',
       is_removed = false,
       removal_reason = NULL,
       moderated_at = NULL,
       moderated_by = NULL
     RETURNING id, slug, title, consent_reference, rights_reference, moderation_status, created_at, updated_at`,
    [sourceId, externalId, slug, title, mediaMode, safeMediaUrl, safeThumbnailUrl, consentReference, rightsReference, attributionText],
  );

  console.log(JSON.stringify({ source: source.rows[0], video: result.rows[0] }, null, 2));
  console.error('Video staged as PENDING moderation. Approval requires an approved source plus consent_reference and rights_reference evidence.');
} finally {
  await pool.end();
}
