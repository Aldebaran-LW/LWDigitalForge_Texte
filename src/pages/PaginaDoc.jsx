import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getDocBySlug, getAllDocs } from '@/lib/docsContent';
import MarkdownContent from '@/components/content/MarkdownContent';
import { Button } from '@/components/ui/button';

const SITE_URL = 'https://www.lwdigitalforge.com';

const PaginaDoc = () => {
  const { slug } = useParams();
  const doc = getDocBySlug(slug);
  const allDocs = getAllDocs();

  if (!doc) return <Navigate to="/docs" replace />;

  const canonical = `${SITE_URL}/docs/${doc.slug}`;
  const related = allDocs.filter((d) => d.slug !== doc.slug && d.category === doc.category);

  return (
    <>
      <Helmet>
        <title>{doc.meta_title}</title>
        <meta name="description" content={doc.meta_description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={doc.meta_title} />
        <meta property="og:description" content={doc.meta_description} />
        <meta property="og:url" content={canonical} />
      </Helmet>

      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <Button asChild variant="ghost" className="mb-6 -ml-2">
            <Link to="/docs" className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <ArrowLeft size={16} />
              Voltar à documentação
            </Link>
          </Button>

          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {doc.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-8">
            {doc.title}
          </h1>

          <MarkdownContent content={doc.body} />

          {related.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/10">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
                Nesta categoria
              </p>
              <ul className="space-y-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      to={`/docs/${r.slug}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PaginaDoc;
