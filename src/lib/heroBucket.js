/** Bucket público para banners da home (Supabase Storage). */
export const HERO_LW_BUCKET = 'Hero-LW_Digital_Forge';

/**
 * URL pública de um ficheiro no bucket hero.
 * @param {string} path - Caminho dentro do bucket (ex: slides/foto.webp)
 */
export function getHeroBucketPublicUrl(path) {
  const base =
    import.meta.env.VITE_SUPABASE_URL || 'https://wwwwyuwighdehmvnolrl.supabase.co';
  const clean = String(path || '').replace(/^\//, '');
  if (!clean) return '';
  return `${base}/storage/v1/object/public/${HERO_LW_BUCKET}/${clean}`;
}
