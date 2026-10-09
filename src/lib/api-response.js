/**
 * Standard API Response Helper for Zaell API Stats
 */

export function jsonResponse(data, status = 200) {
  return new Response(
    JSON.stringify({
      status: true,
      creator: 'Zaell API',
      ...data,
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}

export function errorResponse(message, status = 400) {
  return new Response(
    JSON.stringify({
      status: false,
      creator: 'Zaell API',
      error: typeof message === 'string' ? message : message?.message || 'Internal Server Error',
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}

export function optionsResponse() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
