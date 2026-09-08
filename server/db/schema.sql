BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
  CREATE TYPE source_authorization_status AS ENUM ('pending', 'approved', 'revoked');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'rejected', 'blocked');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE case_status AS ENUM ('open', 'reviewing', 'actioned', 'closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS content_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  source_type text NOT NULL CHECK (source_type IN ('api', 'feed', 'embed', 'licensed_upload')),
  base_url text,
  authorization_status source_authorization_status NOT NULL DEFAULT 'pending',
  authorization_reference text,
  terms_reviewed_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid NOT NULL REFERENCES content_sources(id) ON DELETE RESTRICT,
  external_id text NOT NULL,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  duration_seconds integer CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
  media_mode text NOT NULL CHECK (media_mode IN ('embed', 'remote_stream', 'licensed_hosted')),
  media_url text NOT NULL,
  thumbnail_url text,
  attribution_text text,
  consent_reference text,
  rights_reference text,
  moderation_status moderation_status NOT NULL DEFAULT 'pending',
  is_removed boolean NOT NULL DEFAULT false,
  removal_reason text,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_id, external_id)
);

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  label text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS video_categories (
  video_id uuid NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (video_id, category_id)
);

CREATE TABLE IF NOT EXISTS content_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE SET NULL,
  content_reference text NOT NULL,
  reason text NOT NULL,
  details text NOT NULL,
  contact_email text,
  status case_status NOT NULL DEFAULT 'open',
  priority smallint NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS takedown_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE SET NULL,
  request_type text NOT NULL,
  content_reference text NOT NULL,
  requester_name text NOT NULL,
  contact_email text NOT NULL,
  basis text NOT NULL,
  attested_accurate boolean NOT NULL DEFAULT false,
  status case_status NOT NULL DEFAULT 'open',
  priority smallint NOT NULL DEFAULT 2 CHECK (priority BETWEEN 1 AND 5),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS videos_source_idx ON videos(source_id);
CREATE INDEX IF NOT EXISTS videos_public_idx ON videos(moderation_status, is_removed, published_at DESC);
CREATE INDEX IF NOT EXISTS reports_status_idx ON content_reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS takedown_status_idx ON takedown_requests(status, created_at DESC);

CREATE OR REPLACE VIEW public_videos AS
SELECT
  v.id,
  v.slug,
  v.title,
  v.description,
  v.duration_seconds,
  v.media_mode,
  v.media_url,
  v.thumbnail_url,
  v.attribution_text,
  v.published_at,
  v.created_at
FROM videos v
JOIN content_sources s ON s.id = v.source_id
WHERE s.authorization_status = 'approved'
  AND v.moderation_status = 'approved'
  AND v.is_removed = false;

COMMIT;
