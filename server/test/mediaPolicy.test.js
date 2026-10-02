import test from 'node:test';
import assert from 'node:assert/strict';
import { isAllowedRemoteUrl, sanitizePublicVideo } from '../src/mediaPolicy.js';

test('accepts exact HTTPS allowlisted host', () => {
  assert.equal(isAllowedRemoteUrl('https://media.example.com/video.mp4', ['media.example.com']), true);
});

test('accepts HTTPS subdomains of an allowlisted parent host', () => {
  assert.equal(isAllowedRemoteUrl('https://cdn.media.example.com/video.mp4', ['example.com']), true);
});

test('rejects lookalike host suffixes', () => {
  assert.equal(isAllowedRemoteUrl('https://example.com.attacker.test/video.mp4', ['example.com']), false);
});

test('rejects HTTP, malformed URLs, and empty host policy', () => {
  assert.equal(isAllowedRemoteUrl('http://media.example.com/video.mp4', ['media.example.com']), false);
  assert.equal(isAllowedRemoteUrl('not-a-url', ['media.example.com']), false);
  assert.equal(isAllowedRemoteUrl('https://media.example.com/video.mp4', []), false);
});

test('sanitizer strips unapproved media and thumbnails', () => {
  const result = sanitizePublicVideo({
    slug: 'qa-one',
    media_url: 'https://media.example.com/video.mp4',
    thumbnail_url: 'https://other.example.net/thumb.jpg',
    source_type: 'licensed_upload',
    allowed_media_hosts: ['media.example.com'],
  });

  assert.equal(result.media_url, 'https://media.example.com/video.mp4');
  assert.equal(result.media_allowed, true);
  assert.equal(result.thumbnail_url, null);
  assert.equal(result.source_type, 'licensed_upload');
  assert.equal('allowed_media_hosts' in result, false);
});

test('sanitizer blocks all remote media when source has no allowlist', () => {
  const result = sanitizePublicVideo({
    slug: 'qa-two',
    media_url: 'https://media.example.com/video.mp4',
    thumbnail_url: null,
    source_type: 'embed',
    allowed_media_hosts: [],
  });

  assert.equal(result.media_url, null);
  assert.equal(result.media_allowed, false);
  assert.equal(result.thumbnail_url, null);
});
