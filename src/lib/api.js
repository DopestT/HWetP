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

export function submitContentReport(data) {
  return request('/api/reports', { method: 'POST', body: JSON.stringify(data) });
}

export function submitTakedownRequest(data) {
  return request('/api/takedowns', { method: 'POST', body: JSON.stringify(data) });
}
