/**
 * Google API Integration: Photos Library + Drive
 * Uses Google Identity Services (GIS) for OAuth token management
 * and direct fetch() calls to Google REST APIs.
 */

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/photoslibrary.readonly',
  'https://www.googleapis.com/auth/drive.file',
].join(' ');

// Carrega o script do Google Identity Services dinamicamente
export const loadGoogleIdentityServices = () => {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }
    const existingScript = document.getElementById('google-gis-script');
    if (existingScript) {
      existingScript.addEventListener('load', resolve);
      existingScript.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-gis-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Falha ao carregar Google Identity Services'));
    document.head.appendChild(script);
  });
};

// Inicializa o cliente de token OAuth
export const createTokenClient = (onSuccess, onError) => {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error('VITE_GOOGLE_CLIENT_ID não configurado. Adicione no arquivo .env');
  }
  return window.google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: GOOGLE_SCOPES,
    callback: (response) => {
      if (response.error) {
        onError?.(new Error(response.error));
      } else {
        onSuccess?.(response);
      }
    },
  });
};

// ─── Google Photos Library API ─────────────────────────────────────────────

export const listPhotos = async (accessToken, pageToken = null, pageSize = 50) => {
  const params = new URLSearchParams({ pageSize: String(pageSize) });
  if (pageToken) params.set('pageToken', pageToken);

  const res = await fetch(
    `https://photoslibrary.googleapis.com/v1/mediaItems?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Erro ao listar fotos do Google Photos');
  }
  return res.json();
};

export const listAlbums = async (accessToken, pageToken = null) => {
  const params = new URLSearchParams({ pageSize: '50' });
  if (pageToken) params.set('pageToken', pageToken);

  const res = await fetch(
    `https://photoslibrary.googleapis.com/v1/albums?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Erro ao listar álbuns');
  }
  return res.json();
};

export const listAlbumPhotos = async (accessToken, albumId, pageToken = null, pageSize = 50) => {
  const body = { albumId, pageSize };
  if (pageToken) body.pageToken = pageToken;

  const res = await fetch('https://photoslibrary.googleapis.com/v1/mediaItems:search', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Erro ao listar fotos do álbum');
  }
  return res.json();
};

// ─── Google Drive API ───────────────────────────────────────────────────────

export const createDriveFolder = async (accessToken, name, parentFolderId = null) => {
  const metadata = {
    name,
    mimeType: 'application/vnd.google-apps.folder',
    ...(parentFolderId && { parents: [parentFolderId] }),
  };

  const res = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Erro ao criar pasta no Drive');
  }
  return res.json();
};

export const listDriveFiles = async (accessToken, folderId) => {
  const q = encodeURIComponent(`'${folderId}' in parents and trashed=false`);
  const fields = encodeURIComponent(
    'files(id,name,mimeType,thumbnailLink,webViewLink,webContentLink,size,createdTime,imageMediaMetadata)'
  );
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${q}&fields=${fields}&orderBy=createdTime+desc`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Erro ao listar arquivos do Drive');
  }
  return res.json();
};

export const getDriveFile = async (accessToken, fileId) => {
  const fields = encodeURIComponent(
    'id,name,mimeType,thumbnailLink,webViewLink,size,createdTime'
  );
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?fields=${fields}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) throw new Error('Erro ao buscar arquivo do Drive');
  return res.json();
};

export const deleteDriveFile = async (accessToken, fileId) => {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok && res.status !== 204) throw new Error('Erro ao deletar arquivo do Drive');
};

// Copia uma foto do Google Photos para uma pasta no Drive
export const copyPhotoToDrive = async (accessToken, photo, folderId) => {
  const imageUrl = `${photo.baseUrl}=d`; // =d para download
  const photoRes = await fetch(imageUrl);
  if (!photoRes.ok) throw new Error('Erro ao baixar foto do Google Photos');
  const blob = await photoRes.blob();

  const fileName = photo.filename || `photo_${photo.id}.jpg`;
  const mimeType = photo.mimeType || blob.type || 'image/jpeg';

  const metadata = { name: fileName, parents: [folderId] };
  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append('file', blob, fileName);

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,thumbnailLink,webViewLink,size,createdTime',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form,
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Erro ao fazer upload para o Drive');
  }
  return res.json();
};

// Obtém o thumbnail de um arquivo do Drive (retorna URL autenticada via blob)
export const getDriveThumbnailUrl = async (accessToken, fileId) => {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?fields=thumbnailLink`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.thumbnailLink || null;
};

// Formata tamanho de arquivo legível
export const formatFileSize = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};
