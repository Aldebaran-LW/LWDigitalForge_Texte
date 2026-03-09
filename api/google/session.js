import { getAuthorizedGoogleSession } from '../_lib/google.js';
import { methodNotAllowed, sendJson } from '../_lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET']);
  }

  try {
    const session = await getAuthorizedGoogleSession(req, res);

    if (!session) {
      return sendJson(res, 200, {
        connected: false,
      });
    }

    return sendJson(res, 200, {
      connected: true,
      profile: {
        email: session.email,
        name: session.name,
        picture: session.picture,
        connectedAt: session.connectedAt,
        updatedAt: session.updatedAt,
      },
      scopes: session.scope?.split(' ').filter(Boolean) || [],
    });
  } catch (error) {
    return sendJson(res, 401, {
      connected: false,
      error: error.message,
    });
  }
}
