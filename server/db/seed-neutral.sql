BEGIN;

INSERT INTO content_sources (
  id,
  name,
  source_type,
  base_url,
  authorization_status,
  authorization_reference,
  terms_reviewed_at
) VALUES (
  '00000000-0000-4000-8000-000000000001',
  'HERWET Neutral QA Catalog',
  'embed',
  'https://example.invalid',
  'approved',
  'QA-ONLY-NO-REAL-MEDIA',
  now()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (slug, label, description) VALUES
  ('current', 'Current', 'Fast-moving QA catalog items.'),
  ('fresh', 'Fresh', 'Recently surfaced QA catalog items.'),
  ('deep-finds', 'Deep Finds', 'QA discovery below the obvious.'),
  ('explore', 'Explore', 'Broad QA browsing.'),
  ('collections', 'Collections', 'Curated QA groups.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO videos (
  id, source_id, external_id, slug, title, description, duration_seconds,
  media_mode, media_url, attribution_text, consent_reference, rights_reference,
  moderation_status, published_at
) VALUES
  ('10000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'QA-01', 'current-one', 'Current One', 'Neutral QA record used to validate the production catalog pipeline.', 728, 'embed', 'https://example.invalid/qa/current-one', 'HERWET Neutral QA', 'QA-NONCONTENT', 'QA-NONCONTENT', 'approved', now() - interval '1 day'),
  ('10000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001', 'QA-02', 'current-two', 'Current Two', 'Neutral QA record used to validate search, category, and watch routes.', 522, 'embed', 'https://example.invalid/qa/current-two', 'HERWET Neutral QA', 'QA-NONCONTENT', 'QA-NONCONTENT', 'approved', now() - interval '2 days'),
  ('10000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000001', 'QA-03', 'current-three', 'Current Three', 'Neutral QA record. No real media is attached.', 931, 'embed', 'https://example.invalid/qa/current-three', 'HERWET Neutral QA', 'QA-NONCONTENT', 'QA-NONCONTENT', 'approved', now() - interval '3 days'),
  ('10000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000001', 'QA-04', 'current-four', 'Current Four', 'Neutral QA record for production visual and API validation.', 614, 'embed', 'https://example.invalid/qa/current-four', 'HERWET Neutral QA', 'QA-NONCONTENT', 'QA-NONCONTENT', 'approved', now() - interval '4 days'),
  ('10000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000001', 'QA-05', 'deep-five', 'Deep Five', 'Neutral QA record for category filtering.', 418, 'embed', 'https://example.invalid/qa/deep-five', 'HERWET Neutral QA', 'QA-NONCONTENT', 'QA-NONCONTENT', 'approved', now() - interval '5 days'),
  ('10000000-0000-4000-8000-000000000006', '00000000-0000-4000-8000-000000000001', 'QA-06', 'night-current', 'Night Current', 'Neutral QA record for related-content flow.', 1102, 'embed', 'https://example.invalid/qa/night-current', 'HERWET Neutral QA', 'QA-NONCONTENT', 'QA-NONCONTENT', 'approved', now() - interval '6 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO video_categories (video_id, category_id)
SELECT mapping.video_id, c.id
FROM (
  VALUES
    ('10000000-0000-4000-8000-000000000001'::uuid, 'current'),
    ('10000000-0000-4000-8000-000000000001'::uuid, 'explore'),
    ('10000000-0000-4000-8000-000000000002'::uuid, 'fresh'),
    ('10000000-0000-4000-8000-000000000002'::uuid, 'current'),
    ('10000000-0000-4000-8000-000000000003'::uuid, 'deep-finds'),
    ('10000000-0000-4000-8000-000000000003'::uuid, 'collections'),
    ('10000000-0000-4000-8000-000000000004'::uuid, 'current'),
    ('10000000-0000-4000-8000-000000000004'::uuid, 'collections'),
    ('10000000-0000-4000-8000-000000000005'::uuid, 'fresh'),
    ('10000000-0000-4000-8000-000000000005'::uuid, 'deep-finds'),
    ('10000000-0000-4000-8000-000000000006'::uuid, 'deep-finds'),
    ('10000000-0000-4000-8000-000000000006'::uuid, 'explore')
) AS mapping(video_id, category_slug)
JOIN categories c ON c.slug = mapping.category_slug
ON CONFLICT DO NOTHING;

COMMIT;
