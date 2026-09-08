import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;
const [name, sourceType, baseUrl = '', authorizationReference = ''] = process.argv.slice(2);

if (!name || !sourceType) {
  console.error('Usage: node scripts/register-source.js <name> <api|feed|embed|licensed_upload> [baseUrl] [authorizationReference]');
  process.exit(1);
}

if (!['api', 'feed', 'embed', 'licensed_upload'].includes(sourceType)) {
  console.error('Invalid source type.');
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
try {
  const result = await pool.query(
    `INSERT INTO content_sources
      (name, source_type, base_url, authorization_reference, authorization_status)
     VALUES ($1, $2, NULLIF($3, ''), NULLIF($4, ''), 'pending')
     RETURNING id, name, source_type, authorization_status, created_at`,
    [name, sourceType, baseUrl, authorizationReference],
  );
  console.log(JSON.stringify(result.rows[0], null, 2));
  console.error('Source registered as PENDING. It cannot appear publicly until authorization and moderation are explicitly approved.');
} finally {
  await pool.end();
}
