import { createDriveFolder } from '../../_lib/google.js';
import { methodNotAllowed, sendJson } from '../../_lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST']);
  }

  try {
    const { name } = req.body || {};

    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      return sendJson(res, 400, {
        error: 'Informe um nome de cofre com pelo menos 3 caracteres.',
      });
    }

    const folder = await createDriveFolder(req, res, name.trim());

    return sendJson(res, 200, {
      success: true,
      folder,
    });
  } catch (error) {
    return sendJson(res, 500, {
      error: error.message,
    });
  }
}
