/** @param {string} text */
export function heroGalleryFromTextarea(text) {
  if (!text || !String(text).trim()) return [];
  return [
    ...new Set(
      String(text)
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    ),
  ];
}

/** @param {unknown} arr */
export function heroGalleryToTextarea(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return '';
  return arr.filter(Boolean).join('\n');
}
