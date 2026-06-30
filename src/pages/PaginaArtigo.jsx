import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Calendar, Loader2, Tag, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import MarkdownContent from '@/components/content/MarkdownContent';
import { Button } from '@/components/ui/button';

const SITE_URL = 'https://www.lwdigitalforge.com';

const formatDate = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const PaginaArtigo = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
      } else {
        setPost(data);
      }
      setLoading(false);
    };
    if (slug) fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (notFound) return <Navigate to="/blog" replace />;

  const canonical = `${SITE_URL}/blog/${post.slug}`;
  const metaTitle = post.meta_title || `${post.title} | LWDigitalForge`;
  const metaDescription = post.meta_description || post.excerpt || '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: metaDescription,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { '@type': 'Organization', name: post.author_name || 'LWDigitalForge' },
    publisher: { '@type': 'Organization', name: 'LWDigitalForge' },
    mainEntityOfPage: canonical,
    image: post.cover_image_url || undefined,
  };

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonical} />
        {post.cover_image_url && <meta property="og:image" content={post.cover_image_url} />}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <article className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <Button asChild variant="ghost" className="mb-6 -ml-2">
            <Link to="/blog" className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <ArrowLeft size={16} />
              Voltar ao blog
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300">
              <Tag size={12} />
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar size={14} />
              {formatDate(post.published_at)}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {post.title}
          </h1>

          {post.cover_image_url && (
            <img
              src={post.cover_image_url}
              alt=""
              className="w-full rounded-2xl mb-8 object-cover max-h-[400px]"
            />
          )}

          <MarkdownContent content={post.content} />

          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-500/10 dark:to-violet-500/10 border border-blue-100 dark:border-blue-500/20">
            <p className="font-semibold text-gray-900 dark:text-white mb-2">
              Quer uma solução como esta na sua empresa?
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Fale com a LW Digital Forge e receba um orçamento personalizado.
            </p>
            <Button asChild className="btn-primary rounded-xl">
              <Link to="/contato-orcamento">Solicitar orçamento</Link>
            </Button>
          </div>
        </div>
      </article>
    </>
  );
};

export default PaginaArtigo;
