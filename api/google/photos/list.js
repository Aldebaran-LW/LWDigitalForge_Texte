import { fetchGoogleJson } from '../../_lib/google.js';
import { methodNotAllowed, sendJson } from '../../_lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET']);
  }

  try {
    const pageSize = Math.min(Math.max(Number(req.query.pageSize || 24), 1), 50);
    const pageToken = typeof req.query.pageToken === 'string' ? req.query.pageToken : '';

    const params = new URLSearchParams({
      pageSize: String(pageSize),
    });

    if (pageToken) {
      params.set('pageToken', pageToken);
    }

    const response = await fetchGoogleJson(
      req,
      res,
      `https://photoslibrary.googleapis.com/v1/mediaItems?${params.toString()}`
    );

    if (!response.ok) {
      return sendJson(res, response.status, {
        error: response.data.error?.message || response.data.error || 'Falha ao listar a biblioteca do Google Photos.',
      });
    }

    const items = (response.data.mediaItems || []).map((item) => ({
      id: item.id,
      baseUrl: item.baseUrl,
      filename: item.filename,
      mimeType: item.mimeType,
      productUrl: item.productUrl,
      mediaMetadata: item.mediaMetadata,
      thumbnailUrl: item.baseUrl ? `${item.baseUrl}=w512-h512-c` : null,
    }));

    return sendJson(res, 200, {
      items,
      nextPageToken: response.data.nextPageToken || null,
    });
  } catch (error) {
    return sendJson(res, 500, {
      error: error.message,
    });
  }
}
