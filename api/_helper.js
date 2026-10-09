export function sendJson(res, data, statusCode = 200) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res.status(statusCode).json({
    status: true,
    creator: 'Zaell API',
    ...data,
  });
}

export function sendError(res, message, statusCode = 400) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res.status(statusCode).json({
    status: false,
    creator: 'Zaell API',
    error: typeof message === 'string' ? message : message?.message || 'Error occurred',
  });
}

export function parseParams(req) {
  const query = req.query || {};
  let body = {};
  if (req.body) {
    if (typeof req.body === 'string') {
      try { body = JSON.parse(req.body); } catch (_) {}
    } else if (typeof req.body === 'object') {
      body = req.body;
    }
  }
  return { ...query, ...body };
}
