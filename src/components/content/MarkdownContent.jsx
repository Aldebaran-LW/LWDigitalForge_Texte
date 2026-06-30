import React from 'react';
import { markdownToHtml } from '@/lib/markdown';

const MarkdownContent = ({ content, className = '' }) => {
  if (!content) return null;
  return (
    <article
      className={`prose-content max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
    />
  );
};

export default MarkdownContent;
