export function isAllowedRemoteUrl(value, allowedHosts = []) {
  if (!value || !Array.isArray(allowedHosts) || !allowedHosts.length) return false;

  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'https:') return false;

    const host = parsed.hostname.toLowerCase();
    return allowedHosts.some((allowedHost) => {
      const normalized = String(allowedHost).trim().toLowerCase();
      return normalized && (host === normalized || host.endsWith(`.${normalized}`));
    });
  } catch {
    return false;
  }
}

export function sanitizePublicVideo(row) {
  const { allowed_media_hosts: allowedHosts = [], source_type: sourceType, ...video } = row;
  const mediaAllowed = isAllowedRemoteUrl(video.media_url, allowedHosts);
  const thumbnailAllowed = !video.thumbnail_url || isAllowedRemoteUrl(video.thumbnail_url, allowedHosts);

  return {
    ...video,
    media_url: mediaAllowed ? video.media_url : null,
    thumbnail_url: thumbnailAllowed ? video.thumbnail_url : null,
    media_allowed: mediaAllowed,
    source_type: sourceType,
  };
}
