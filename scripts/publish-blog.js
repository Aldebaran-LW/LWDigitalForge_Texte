/**
 * Publica artigos de content/blog/*.md na tabela blog_posts (Supabase).
 * Uso: npm run blog:publish | npm run blog:publish:dry
 * .env: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BLOG_DIR = path.resolve(__dirname, '../content/blog');
const dryRun = process.argv.includes('--dry-run');

function slugify(text) {
  if (!text) return '';
  return String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw.trim() };
  const meta = {};
  match[1].split('\n').forEach((line) => {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (value === 'true') value = true;
    if (value === 'false') value = false;
    if (key) meta[key] = value;
  });
  return { meta, body: match[2].trim() };
}

function pick(meta, ...keys) {
  for (const key of keys) {
    if (meta[key] !== undefined && meta[key] !== '') return meta[key];
  }
  return undefined;
}

function buildPostFromFile(filePath, raw) {
  const fileName = path.basename(filePath, '.md');
  const { meta, body } = parseFrontmatter(raw);
  const title = pick(meta, 'title') || fileName.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const slug = pick(meta, 'slug') || slugify(title);
  const excerpt = pick(meta, 'excerpt') || body.replace(/[#*`[\]]/g, '').substring(0, 200).trim() + '...';
  const isPublished = pick(meta, 'is_published', 'isPublished');
  const is_published = isPublished === undefined ? true : Boolean(isPublished);
  let cover = pick(meta, 'cover_image_url', 'featuredImage');
  if (cover && !String(cover).startsWith('http')) cover = null;
  return {
    slug,
    title,
    excerpt,
    content: body,
    category: pick(meta, 'category') || 'Geral',
    author_name: pick(meta, 'author_name', 'author') || 'Equipe LW',
    meta_title: pick(meta, 'meta_title', 'metaTitle') || title,
    meta_description: (pick(meta, 'meta_description', 'metaDescription') || excerpt).substring(0, 160),
    cover_image_url: cover || null,
    is_published,
    published_at: is_published ? (pick(meta, 'published_at', 'publishedAt') || new Date().toISOString()) : null,
  };
}

async function main() {
  console.log('Publicador de blog\n');
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Defina VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env');
    process.exit(1);
  }
  if (dryRun) console.log('Dry-run\n');
  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const files = (await fs.readdir(BLOG_DIR)).filter((f) => f.endsWith('.md') && f.toLowerCase() !== 'readme.md');
  if (!files.length) { console.log('Nenhum .md em content/blog/'); process.exit(0); }
  let ok = 0, fail = 0;
  for (const file of files) {
    const fp = path.join(BLOG_DIR, file);
    const post = buildPostFromFile(fp, (await fs.readFile(fp, 'utf-8')).replace(/^\uFEFF/, ''));
    console.log(file, '->', post.slug);
    if (dryRun) continue;
    const { error } = await supabase.from('blog_posts').upsert(post, { onConflict: 'slug' });
    if (error) { console.error('  ', error.message); fail++; } else { ok++; }
  }
  console.log(dryRun ? 'Dry-run OK' : `OK: ${ok} | Falhas: ${fail}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
