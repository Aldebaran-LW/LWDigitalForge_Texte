import crypto from 'node:crypto';

import { clearCookie, getBaseUrl, parseCookies, setCookie } from './http.js';

const GOOGLE_SESSION_COOKIE = 'photovault_google_session';
const GOOGLE_STATE_COOKIE = 'photovault_google_state';
const GOOGLE_SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const GOOGLE_SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/photoslibrary.readonly',
];

function getRequiredEnv(name, fallbackNames = []) {
  const names = [name, ...fallbackNames];

  for (const envName of names) {
    const value = process.env[envName];
    if (value) {
      return value;
    }
  }

  throw new Error(`Variavel de ambiente ausente: ${name}`);
}

function getCookieSecret() {
  return getRequiredEnv('GOOGLE_COOKIE_SECRET', ['SESSION_SECRET']);
}

function getEncryptionKey() {
  return crypto.createHash('sha256').update(getCookieSecret()).digest();
}

function encryptPayload(payload) {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const content = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString('base64url')}.${authTag.toString('base64url')}.${content.toString('base64url')}`;
}

function decryptPayload(token) {
  if (!token) {
    return null;
  }

  const [ivPart, authTagPart, contentPart] = token.split('.');
  if (!ivPart || !authTagPart || !contentPart) {
    return null;
  }

  try {
    const key = getEncryptionKey();
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      key,
      Buffer.from(ivPart, 'base64url')
    );

    decipher.setAuthTag(Buffer.from(authTagPart, 'base64url'));

    const content = Buffer.concat([
      decipher.update(Buffer.from(contentPart, 'base64url')),
      decipher.final(),
    ]);

    return JSON.parse(content.toString('utf8'));
  } catch (_error) {
    return null;
  }
}

export function getGoogleOAuthUrl(req, returnTo = '/portal/photovault') {
  const state = crypto.randomBytes(24).toString('hex');
  const clientId = getRequiredEnv('GOOGLE_CLIENT_ID');
  const redirectUri = `${getBaseUrl(req)}/api/google/oauth/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true',
    scope: GOOGLE_SCOPES.join(' '),
    state,
  });

  return {
    url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    statePayload: {
      value: state,
      returnTo,
      createdAt: Date.now(),
    },
  };
}

export function persistGoogleState(res, statePayload) {
  setCookie(res, GOOGLE_STATE_COOKIE, encryptPayload(statePayload), {
    maxAge: 60 * 10,
  });
}

export function readGoogleState(req) {
  const cookies = parseCookies(req);
  return decryptPayload(cookies[GOOGLE_STATE_COOKIE]);
}

export function clearGoogleState(res) {
  clearCookie(res, GOOGLE_STATE_COOKIE);
}

export function persistGoogleSession(res, sessionPayload) {
  setCookie(res, GOOGLE_SESSION_COOKIE, encryptPayload(sessionPayload), {
    maxAge: GOOGLE_SESSION_MAX_AGE,
  });
}

export function readGoogleSession(req) {
  const cookies = parseCookies(req);
  return decryptPayload(cookies[GOOGLE_SESSION_COOKIE]);
}

export function clearGoogleSession(res) {
  clearCookie(res, GOOGLE_SESSION_COOKIE);
}

export function buildCallbackRedirect(pathname, status, message = '') {
  const base = pathname || '/portal/photovault';
  const separator = base.includes('?') ? '&' : '?';
  const errorPart = message ? `&message=${encodeURIComponent(message)}` : '';
  return `${base}${separator}google=${encodeURIComponent(status)}${errorPart}`;
}

export async function exchangeCodeForTokens(req, code) {
  const clientId = getRequiredEnv('GOOGLE_CLIENT_ID');
  const clientSecret = getRequiredEnv('GOOGLE_CLIENT_SECRET');
  const redirectUri = `${getBaseUrl(req)}/api/google/oauth/callback`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error_description || payload.error || 'Falha ao trocar o codigo OAuth.');
  }

  return payload;
}

async function refreshAccessToken(refreshToken) {
  const clientId = getRequiredEnv('GOOGLE_CLIENT_ID');
  const clientSecret = getRequiredEnv('GOOGLE_CLIENT_SECRET');

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error_description || payload.error || 'Falha ao renovar o token Google.');
  }

  return payload;
}

export async function fetchGoogleProfile(accessToken) {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error_description || payload.error || 'Falha ao buscar perfil Google.');
  }

  return payload;
}

export async function getAuthorizedGoogleSession(req, res) {
  const session = readGoogleSession(req);

  if (!session) {
    return null;
  }

  const now = Date.now();
  if (session.accessToken && session.expiresAt && session.expiresAt - now > 60_000) {
    return session;
  }

  if (!session.refreshToken) {
    throw new Error('Sessao Google sem refresh token.');
  }

  const refreshed = await refreshAccessToken(session.refreshToken);
  const nextSession = {
    ...session,
    accessToken: refreshed.access_token,
    expiresAt: Date.now() + Number(refreshed.expires_in || 3600) * 1000,
    scope: refreshed.scope || session.scope,
    tokenType: refreshed.token_type || session.tokenType || 'Bearer',
    updatedAt: new Date().toISOString(),
  };

  persistGoogleSession(res, nextSession);
  return nextSession;
}

export async function fetchGoogleJson(req, res, url, options = {}) {
  const session = await getAuthorizedGoogleSession(req, res);

  if (!session) {
    return {
      status: 401,
      ok: false,
      data: { error: 'Conta Google nao conectada.' },
      session: null,
    };
  }

  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${session.accessToken}`);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : { raw: await response.text() };

  return {
    status: response.status,
    ok: response.ok,
    data,
    session,
  };
}

export async function fetchGoogleBuffer(req, res, url, options = {}) {
  const session = await getAuthorizedGoogleSession(req, res);

  if (!session) {
    throw new Error('Conta Google nao conectada.');
  }

  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${session.accessToken}`);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Falha ao baixar o arquivo do Google Photos.');
  }

  const arrayBuffer = await response.arrayBuffer();

  return {
    buffer: Buffer.from(arrayBuffer),
    session,
    contentType: response.headers.get('content-type') || 'application/octet-stream',
  };
}

export async function revokeGoogleToken(token) {
  if (!token) {
    return;
  }

  await fetch('https://oauth2.googleapis.com/revoke', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ token }),
  }).catch(() => {
    return null;
  });
}

export async function ensurePhotoVaultRootFolder(req, res) {
  const query = new URLSearchParams({
    q: "mimeType = 'application/vnd.google-apps.folder' and trashed = false and appProperties has { key='photovaultRoot' and value='true' }",
    pageSize: '1',
    fields: 'files(id,name,webViewLink)',
  });

  const existing = await fetchGoogleJson(
    req,
    res,
    `https://www.googleapis.com/drive/v3/files?${query.toString()}`
  );

  if (existing.ok && existing.data.files?.length) {
    return existing.data.files[0];
  }

  const createRoot = await fetchGoogleJson(req, res, 'https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'PhotoVault',
      mimeType: 'application/vnd.google-apps.folder',
      appProperties: {
        photovaultRoot: 'true',
      },
    }),
  });

  if (!createRoot.ok) {
    throw new Error(createRoot.data.error?.message || 'Nao foi possivel criar a pasta raiz do PhotoVault.');
  }

  return createRoot.data;
}

export async function createDriveFolder(req, res, name) {
  const rootFolder = await ensurePhotoVaultRootFolder(req, res);

  const createResponse = await fetchGoogleJson(
    req,
    res,
    'https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [rootFolder.id],
        appProperties: {
          photovaultVault: 'true',
        },
      }),
    }
  );

  if (!createResponse.ok) {
    throw new Error(createResponse.data.error?.message || 'Nao foi possivel criar a pasta no Google Drive.');
  }

  return createResponse.data;
}

export async function uploadBufferToDrive(req, res, { folderId, fileName, mimeType, buffer, mediaItemId }) {
  const session = await getAuthorizedGoogleSession(req, res);

  if (!session) {
    throw new Error('Conta Google nao conectada.');
  }

  const boundary = `photovault-${crypto.randomUUID()}`;
  const metadata = JSON.stringify({
    name: fileName,
    parents: [folderId],
    appProperties: {
      photovaultSource: 'google-photos',
      googleMediaItemId: mediaItemId,
    },
  });

  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n`, 'utf8'),
    Buffer.from(`--${boundary}\r\nContent-Type: ${mimeType || 'application/octet-stream'}\r\n\r\n`, 'utf8'),
    buffer,
    Buffer.from(`\r\n--${boundary}--`, 'utf8'),
  ]);

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,size', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body,
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error?.message || 'Falha ao enviar arquivo para o Drive.');
  }

  return payload;
}
