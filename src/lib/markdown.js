function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inlineFormat(text) {
  let out = escapeHtml(text);
  out = out.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>');
  return out;
}

export function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { meta: {}, body: raw.trim() };
  }
  const meta = {};
  match[1].split('\n').forEach((line) => {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    if (key) meta[key] = value;
  });
  return { meta, body: match[2].trim() };
}

export function markdownToHtml(markdown) {
  if (!markdown) return '';
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let inList = false;
  let listType = null;

  const closeList = () => {
    if (!inList) return;
    html.push(listType === 'ol' ? '</ol>' : '</ul>');
    inList = false;
    listType = null;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      closeList();
      continue;
    }

    if (trimmed.startsWith('### ')) {
      closeList();
      html.push(`<h3 class="text-xl font-bold mt-8 mb-3">${inlineFormat(trimmed.slice(4))}</h3>`);
      continue;
    }
    if (trimmed.startsWith('## ')) {
      closeList();
      html.push(`<h2 class="text-2xl font-bold mt-10 mb-4">${inlineFormat(trimmed.slice(3))}</h2>`);
      continue;
    }
    if (trimmed.startsWith('# ')) {
      closeList();
      html.push(`<h1 class="text-3xl font-bold mt-10 mb-4">${inlineFormat(trimmed.slice(2))}</h1>`);
      continue;
    }

    const ulMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (ulMatch) {
      if (!inList || listType !== 'ul') {
        closeList();
        html.push('<ul class="list-disc pl-6 space-y-2 my-4">');
        inList = true;
        listType = 'ul';
      }
      html.push(`<li>${inlineFormat(ulMatch[1])}</li>`);
      continue;
    }

    const olMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      if (!inList || listType !== 'ol') {
        closeList();
        html.push('<ol class="list-decimal pl-6 space-y-2 my-4">');
        inList = true;
        listType = 'ol';
      }
      html.push(`<li>${inlineFormat(olMatch[1])}</li>`);
      continue;
    }

    closeList();
    html.push(`<p class="my-4 leading-relaxed text-gray-700 dark:text-gray-300">${inlineFormat(trimmed)}</p>`);
  }

  closeList();
  return html.join('\n');
}
