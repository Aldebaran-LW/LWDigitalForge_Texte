import {
  clearGoogleSession,
  readGoogleSession,
  revokeGoogleToken,
} from '../../_lib/google.js';
import { methodNotAllowed, sendJson } from '../../_lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST']);
  }

  try {
    const session = readGoogleSession(req);

    if (session?.refreshToken) {
      await revokeGoogleToken(session.refreshToken);
    } else if (session?.accessToken) {
      await revokeGoogleToken(session.accessToken);
    }

    clearGoogleSession(res);

    return sendJson(res, 200, {
      success: true,
      connected: false,
    });
  } catch (error) {
    clearGoogleSession(res);
    return sendJson(res, 200, {
      success: true,
      connected: false,
      warning: error.message,
    });
  }
}
