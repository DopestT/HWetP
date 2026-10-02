BEGIN;

ALTER TABLE content_sources
  ADD COLUMN IF NOT EXISTS approved_at timestamptz;
ALTER TABLE content_sources
  ADD COLUMN IF NOT EXISTS approved_by text;

ALTER TABLE videos
  ADD COLUMN IF NOT EXISTS moderated_at timestamptz;
ALTER TABLE videos
  ADD COLUMN IF NOT EXISTS moderated_by text;

CREATE TABLE IF NOT EXISTS moderation_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor text NOT NULL,
  action_type text NOT NULL CHECK (action_type IN (
    'source.approve', 'source.revoke', 'source.reopen',
    'video.approve', 'video.reject', 'video.block', 'video.reopen'
  )),
  target_type text NOT NULL CHECK (target_type IN ('source', 'video')),
  target_id uuid NOT NULL,
  reason text NOT NULL,
  previous_state jsonb NOT NULL,
  new_state jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS moderation_actions_target_idx
  ON moderation_actions(target_type, target_id, created_at DESC);
CREATE INDEX IF NOT EXISTS moderation_actions_actor_idx
  ON moderation_actions(actor, created_at DESC);

COMMIT;
