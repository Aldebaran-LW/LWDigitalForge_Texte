# Blog — publicação via Markdown

Coloque arquivos `.md` aqui e execute:

```bash
npm run blog:publish:dry
npm run blog:publish
```

## Frontmatter

```yaml
---
title: "Título"
slug: url-amigavel
excerpt: "Resumo"
category: "Educação"
author_name: "Equipe LW"
is_published: true
published_at: "2026-06-03T12:00:00Z"
meta_title: "SEO título"
meta_description: "SEO descrição"
cover_image_url: "https://..."
---
```

Corpo em Markdown (##, listas, **negrito**, links).

## .env (local, não commitar)

- `VITE_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (Dashboard → Settings → API → service_role)
