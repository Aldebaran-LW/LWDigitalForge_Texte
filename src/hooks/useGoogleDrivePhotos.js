import { useState, useCallback, useRef } from 'react';
import {
  loadGoogleIdentityServices,
  createTokenClient,
  listPhotos,
  listAlbums,
  listAlbumPhotos,
  createDriveFolder,
  listDriveFiles,
  copyPhotoToDrive,
  deleteDriveFile,
} from '@/lib/googleApi';

export const useGoogleDrivePhotos = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [tokenExpiry, setTokenExpiry] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);
  const tokenClientRef = useRef(null);

  const isTokenValid = useCallback(() => {
    if (!accessToken || !tokenExpiry) return false;
    return Date.now() < tokenExpiry - 60_000; // 1 min de margem
  }, [accessToken, tokenExpiry]);

  // Conecta com Google e obtém token de acesso
  const connectGoogle = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      await loadGoogleIdentityServices();

      return new Promise((resolve, reject) => {
        tokenClientRef.current = createTokenClient(
          (response) => {
            const expiresIn = response.expires_in || 3600;
            setAccessToken(response.access_token);
            setTokenExpiry(Date.now() + expiresIn * 1000);
            setConnecting(false);
            resolve(response.access_token);
          },
          (err) => {
            setError(err.message);
            setConnecting(false);
            reject(err);
          }
        );
        tokenClientRef.current.requestAccessToken({ prompt: 'consent' });
      });
    } catch (err) {
      setError(err.message);
      setConnecting(false);
      throw err;
    }
  }, []);

  // Renova o token se estiver próximo de expirar
  const ensureValidToken = useCallback(async () => {
    if (isTokenValid()) return accessToken;
    return connectGoogle();
  }, [accessToken, isTokenValid, connectGoogle]);

  const disconnect = useCallback(() => {
    if (accessToken && window.google?.accounts?.oauth2) {
      window.google.accounts.oauth2.revoke(accessToken);
    }
    setAccessToken(null);
    setTokenExpiry(null);
    setError(null);
  }, [accessToken]);

  // ─── Google Photos ─────────────────────────────────────────────────────────

  const fetchPhotos = useCallback(async (pageToken = null, pageSize = 50) => {
    const token = await ensureValidToken();
    return listPhotos(token, pageToken, pageSize);
  }, [ensureValidToken]);

  const fetchAlbums = useCallback(async (pageToken = null) => {
    const token = await ensureValidToken();
    return listAlbums(token, pageToken);
  }, [ensureValidToken]);

  const fetchAlbumPhotos = useCallback(async (albumId, pageToken = null, pageSize = 50) => {
    const token = await ensureValidToken();
    return listAlbumPhotos(token, albumId, pageToken, pageSize);
  }, [ensureValidToken]);

  // ─── Google Drive ──────────────────────────────────────────────────────────

  const createFolder = useCallback(async (name, parentFolderId = null) => {
    const token = await ensureValidToken();
    return createDriveFolder(token, name, parentFolderId);
  }, [ensureValidToken]);

  const getFolderFiles = useCallback(async (folderId) => {
    const token = await ensureValidToken();
    return listDriveFiles(token, folderId);
  }, [ensureValidToken]);

  const savePhotoToVault = useCallback(async (photo, folderId) => {
    const token = await ensureValidToken();
    return copyPhotoToDrive(token, photo, folderId);
  }, [ensureValidToken]);

  const removeFileFromVault = useCallback(async (fileId) => {
    const token = await ensureValidToken();
    return deleteDriveFile(token, fileId);
  }, [ensureValidToken]);

  return {
    accessToken,
    isConnected: isTokenValid(),
    connecting,
    error,
    connectGoogle,
    disconnect,
    ensureValidToken,
    fetchPhotos,
    fetchAlbums,
    fetchAlbumPhotos,
    createFolder,
    getFolderFiles,
    savePhotoToVault,
    removeFileFromVault,
  };
};
