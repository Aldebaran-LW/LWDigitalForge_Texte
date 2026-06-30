import { parseFrontmatter } from '@/lib/markdown';

const docModules = import.meta.glob('../../content/docs/*.md', {
  as: 'raw',
  eager: true,
});

function parseDocModule(raw, filePath) {
  const { meta, body } = parseFrontmatter(raw);
  const fallbackSlug = filePath.split('/').pop()?.replace(/\.md$/, '') || 'doc';
  const slug = meta.slug || fallbackSlug;
  const order = Number(meta.order) || 99;

  return {
    slug,
    title: meta.title || slug,
    category: meta.category || 'Geral',
    description: meta.description || '',
    meta_title: meta.meta_title || meta.title || slug,
    meta_description: meta.meta_description || meta.description || '',
    order,
    body,
  };
}

let cachedDocs = null;

export function getAllDocs() {
  if (cachedDocs) return cachedDocs;
  cachedDocs = Object.entries(docModules)
    .map(([path, raw]) => parseDocModule(raw, path))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'pt-BR'));
  return cachedDocs;
}

export function getDocBySlug(slug) {
  return getAllDocs().find((doc) => doc.slug === slug) || null;
}

export function getDocCategories() {
  const cats = new Set(getAllDocs().map((d) => d.category));
  return Array.from(cats);
}
