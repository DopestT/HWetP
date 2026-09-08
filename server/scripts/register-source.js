import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;
const [name, sourceType, baseUrl = '', authorizationReference = '', allowedHostsCsv = ''] = process.argv.slice(2);

if (!name || !sourceType) {
  console.error('Usage: node scripts/register-source.js <name> <api|feed|embed|licensed_upload> [baseUrl] [authorizationReference] [allowedHostsCsv]');
  process.exit(1);
}

if (!['api', 'feed', 'embed', 'licensed_upload'].includes(sourceType)) {
  console.error('Invalid source type.');
  process.exit(1);
}

function hostnameFromUrl(value) {
  if (!value) return '';
  try {
    const parsed = new URL(value);
    if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error('unsupported protocol');
    return parsed.hostname.toLowerCase();
  } catch {
    throw new Error(`Invalid URL: ${value}`);
  }
}

const explicitHosts = allowedHostsCsv
  .split(',')
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean)
  .map((value) => value.replace(/^https?:\/\//, '').split('/')[0].split(':')[0]);

const baseHost = baseUrl ? hostnameFromUrl(baseUrl) : '';
const allowedMediaHosts = [...new Set([...explicitHosts, baseHost].filter(Boolean))];

if (!allowedMediaHosts.length) {
  console.error('At least one allowed media host is required. Supply baseUrl or allowedHostsCsv.');
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
try {
  const result = await pool.query(
    `INSERT INTO content_sources
      (name, source_type, base_url, allowed_media_hosts, authorization_reference, authorization_status)
     VALUES ($1, $2, NULLIF($3, ''), $4::text[], NULLIF($5, ''), 'pending')
     RETURNING id, name, source_type, base_url, allowed_media_hosts, authorization_status, created_at`,
    [name, sourceType, baseUrl, allowedMediaHosts, authorizationReference],
  );
  console.log(JSON.stringify(result.rows[0], null, 2));
  console.error('Source registered as PENDING. Allowed media hosts are locked. It cannot appear publicly until authorization is explicitly approved.');
} finally {
  await pool.end();
}
