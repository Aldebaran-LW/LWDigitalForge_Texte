import {
  buildCallbackRedirect,
  clearGoogleState,
  exchangeCodeForTokens,
  fetchGoogleProfile,
  persistGoogleSession,
  readGoogleState,
} from '../../_lib/google.js';
import { methodNotAllowed } from '../../_lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET']);
  }

  const statePayload = readGoogleState(req);
  const returnTo = statePayload?.returnTo || '/portal/photovault';

  try {
    const { code, state, error } = req.query;

    if (error) {
      clearGoogleState(res);
      return res.redirect(302, buildCallbackRedirect(returnTo, 'error', String(error)));
    }

    if (!code || !statePayload || state !== statePayload.value) {
      clearGoogleState(res);
      return res.redirect(302, buildCallbackRedirect(returnTo, 'error', 'Estado OAuth invalido.'));
    }

    const tokens = await exchangeCodeForTokens(req, String(code));
    const profile = await fetchGoogleProfile(tokens.access_token);

    persistGoogleSession(res, {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + Number(tokens.expires_in || 3600) * 1000,
      scope: tokens.scope,
      tokenType: tokens.token_type || 'Bearer',
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
      sub: profile.sub,
      connectedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    clearGoogleState(res);
    return res.redirect(302, buildCallbackRedirect(returnTo, 'connected'));
  } catch (error) {
    clearGoogleState(res);
    return res.redirect(302, buildCallbackRedirect(returnTo, 'error', error.message));
  }
}
