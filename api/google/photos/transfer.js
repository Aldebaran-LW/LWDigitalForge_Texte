import { fetchGoogleBuffer, uploadBufferToDrive } from '../../_lib/google.js';
import { methodNotAllowed, sendJson } from '../../_lib/http.js';

function buildDownloadUrl(item) {
  if (!item?.baseUrl) {
    throw new Error('Item sem baseUrl do Google Photos.');
  }

  const isVideo = String(item.mimeType || '').startsWith('video/');
  return `${item.baseUrl}${isVideo ? '=dv' : '=d'}`;
}

function sanitizeFilename(fileName, fallbackId) {
  const trimmed = String(fileName || '').trim();
  if (trimmed) {
    return trimmed;
  }

  return `photovault-${fallbackId || Date.now()}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST']);
  }

  try {
    const { folderId, items } = req.body || {};

    if (!folderId || typeof folderId !== 'string') {
      return sendJson(res, 400, {
        error: 'folderId e obrigatorio.',
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return sendJson(res, 400, {
        error: 'Selecione ao menos um item para transferir.',
      });
    }

    if (items.length > 12) {
      return sendJson(res, 400, {
        error: 'Transfira no maximo 12 itens por vez para manter o processamento estavel na Vercel.',
      });
    }

    const results = [];
    let totalBytes = 0;
    let transferred = 0;
    let failed = 0;

    for (const item of items) {
      try {
        const downloadUrl = buildDownloadUrl(item);
        const downloaded = await fetchGoogleBuffer(req, res, downloadUrl);
        const uploaded = await uploadBufferToDrive(req, res, {
          folderId,
          fileName: sanitizeFilename(item.filename, item.id),
          mimeType: item.mimeType || downloaded.contentType,
          buffer: downloaded.buffer,
          mediaItemId: item.id,
        });

        totalBytes += Number(uploaded.size || downloaded.buffer.length || 0);
        transferred += 1;

        results.push({
          id: item.id,
          fileName: uploaded.name,
          driveFileId: uploaded.id,
          driveUrl: uploaded.webViewLink,
          size: Number(uploaded.size || downloaded.buffer.length || 0),
          success: true,
        });
      } catch (error) {
        failed += 1;
        results.push({
          id: item?.id,
          fileName: item?.filename || null,
          success: false,
          error: error.message,
        });
      }
    }

    return sendJson(res, 200, {
      success: failed === 0,
      items: results,
      summary: {
        total: items.length,
        transferred,
        failed,
        totalBytes,
      },
    });
  } catch (error) {
    return sendJson(res, 500, {
      error: error.message,
    });
  }
}
