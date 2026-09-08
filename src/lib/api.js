async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error || `Request failed (${response.status})`);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }
  return payload;
}

export function fetchVideos({ q = '', category = '', limit = 24, offset = 0 } = {}) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (category) params.set('category', category);
  params.set('limit', String(limit));
  params.set('offset', String(offset));
  return request(`/api/videos?${params.toString()}`);
}

export function fetchVideo(slug) {
  return request(`/api/videos/${encodeURIComponent(slug)}`);
}

export function submitContentReport(data) {
  return request('/api/reports', { method: 'POST', body: JSON.stringify(data) });
}

export function submitTakedownRequest(data) {
  return request('/api/takedowns', { method: 'POST', body: JSON.stringify(data) });
}
