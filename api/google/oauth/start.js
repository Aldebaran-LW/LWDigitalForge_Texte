import { getGoogleOAuthUrl, persistGoogleState } from '../../_lib/google.js';
import { methodNotAllowed } from '../../_lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET']);
  }

  try {
    const returnTo = typeof req.query.returnTo === 'string' ? req.query.returnTo : '/portal/photovault';
    const { url, statePayload } = getGoogleOAuthUrl(req, returnTo);
    persistGoogleState(res, statePayload);
    res.redirect(302, url);
  } catch (error) {
    res.redirect(302, `/portal/photovault?google=error&message=${encodeURIComponent(error.message)}`);
  }
}
