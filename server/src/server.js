import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import pg from 'pg';
import { z } from 'zod';

const { Pool } = pg;
const app = Fastify({ logger: true, trustProxy: true });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

await app.register(helmet, { contentSecurityPolicy: false });
await app.register(cors, {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Origin not allowed'), false);
  },
});
await app.register(rateLimit, { max: 120, timeWindow: '1 minute' });

app.addHook('onClose', async () => {
  await pool.end();
});

app.get('/healthz', async (_request, reply) => {
  try {
    await pool.query('SELECT 1');
    return { ok: true, database: true };
  } catch (error) {
    app.log.error(error);
    return reply.code(503).send({ ok: false, database: false });
  }
});

app.get('/api/videos', async (request) => {
  const querySchema = z.object({
    q: z.string().trim().max(120).optional(),
    category: z.string().trim().max(80).optional(),
    limit: z.coerce.number().int().min(1).max(60).default(24),
    offset: z.coerce.number().int().min(0).max(10000).default(0),
  });
  const { q, category, limit, offset } = querySchema.parse(request.query);

  const values = [];
  const where = [];

  if (q) {
    values.push(`%${q}%`);
    where.push(`(pv.title ILIKE $${values.length} OR COALESCE(pv.description, '') ILIKE $${values.length})`);
  }
  if (category) {
    values.push(category);
    where.push(`EXISTS (
      SELECT 1 FROM video_categories vc_filter
      JOIN categories c_filter ON c_filter.id = vc_filter.category_id
      WHERE vc_filter.video_id = pv.id AND c_filter.slug = $${values.length}
    )`);
  }

  values.push(limit, offset);
  const limitParam = `$${values.length - 1}`;
  const offsetParam = `$${values.length}`;
  const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const result = await pool.query(
    `SELECT pv.id, pv.slug, pv.title, pv.description, pv.duration_seconds,
            pv.media_mode, pv.media_url, pv.thumbnail_url, pv.attribution_text,
            pv.published_at, pv.created_at,
            COALESCE(array_agg(DISTINCT c.slug) FILTER (WHERE c.slug IS NOT NULL), '{}') AS categories
       FROM public_videos pv
       LEFT JOIN video_categories vc ON vc.video_id = pv.id
       LEFT JOIN categories c ON c.id = vc.category_id
       ${clause}
       GROUP BY pv.id, pv.slug, pv.title, pv.description, pv.duration_seconds,
                pv.media_mode, pv.media_url, pv.thumbnail_url, pv.attribution_text,
                pv.published_at, pv.created_at
       ORDER BY pv.published_at DESC NULLS LAST, pv.created_at DESC
       LIMIT ${limitParam} OFFSET ${offsetParam}`,
    values,
  );

  return { items: result.rows, limit, offset };
});

app.get('/api/videos/:slug', async (request, reply) => {
  const { slug } = z.object({ slug: z.string().min(1).max(180) }).parse(request.params);
  const result = await pool.query(
    `SELECT pv.*, COALESCE(array_agg(DISTINCT c.slug) FILTER (WHERE c.slug IS NOT NULL), '{}') AS categories
       FROM public_videos pv
       LEFT JOIN video_categories vc ON vc.video_id = pv.id
       LEFT JOIN categories c ON c.id = vc.category_id
      WHERE pv.slug = $1
      GROUP BY pv.id, pv.slug, pv.title, pv.description, pv.duration_seconds,
               pv.media_mode, pv.media_url, pv.thumbnail_url, pv.attribution_text,
               pv.published_at, pv.created_at`,
    [slug],
  );
  if (!result.rowCount) return reply.code(404).send({ error: 'not_found' });
  return result.rows[0];
});

const reportSchema = z.object({
  contentReference: z.string().trim().min(1).max(500),
  reason: z.string().trim().min(1).max(120),
  details: z.string().trim().min(1).max(5000),
  contactEmail: z.string().email().max(320).optional().or(z.literal('')),
});

app.post('/api/reports', { config: { rateLimit: { max: 10, timeWindow: '1 hour' } } }, async (request, reply) => {
  const body = reportSchema.parse(request.body);
  const result = await pool.query(
    `INSERT INTO content_reports (content_reference, reason, details, contact_email)
     VALUES ($1, $2, $3, NULLIF($4, ''))
     RETURNING id, status, created_at`,
    [body.contentReference, body.reason, body.details, body.contactEmail || ''],
  );
  return reply.code(201).send(result.rows[0]);
});

const takedownSchema = z.object({
  requestType: z.string().trim().min(1).max(120),
  contentReference: z.string().trim().min(1).max(500),
  requesterName: z.string().trim().min(1).max(200),
  contactEmail: z.string().email().max(320),
  basis: z.string().trim().min(1).max(10000),
  attestedAccurate: z.literal(true),
});

app.post('/api/takedowns', { config: { rateLimit: { max: 5, timeWindow: '1 hour' } } }, async (request, reply) => {
  const body = takedownSchema.parse(request.body);
  const result = await pool.query(
    `INSERT INTO takedown_requests
       (request_type, content_reference, requester_name, contact_email, basis, attested_accurate)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, status, created_at`,
    [body.requestType, body.contentReference, body.requesterName, body.contactEmail, body.basis, body.attestedAccurate],
  );
  return reply.code(201).send(result.rows[0]);
});

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof z.ZodError) {
    return reply.code(400).send({ error: 'invalid_request', issues: error.issues });
  }
  app.log.error(error);
  return reply.code(500).send({ error: 'internal_error' });
});

const port = Number(process.env.PORT || 3001);
await app.listen({ port, host: '0.0.0.0' });
