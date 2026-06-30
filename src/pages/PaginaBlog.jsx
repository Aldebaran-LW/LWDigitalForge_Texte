import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Loader2, Tag } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import ContentPageHero from '@/components/content/ContentPageHero';
import { Button } from '@/components/ui/button';

const formatDate = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const PaginaBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, slug, title, excerpt, cover_image_url, category, published_at')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (!error) setPosts(data || []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <>
      <Helmet>
        <title>Blog — LWDigitalForge</title>
        <meta
          name="description"
          content="Artigos sobre desenvolvimento web, sistemas sob medida, gestão de estoque e transformação digital."
        />
        <link rel="canonical" href="https://www.lwdigitalforge.com/blog" />
      </Helmet>

      <ContentPageHero
        badge="Blog"
        title="Insights para o seu negócio"
        description="Conteúdo sobre tecnologia, produtos LW e boas práticas para quem quer digitalizar processos."
      />

      <section className="container mx-auto px-6 pb-20">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          </div>
        ) : posts.length === 0 ? (
          <div className="max-w-xl mx-auto text-center py-16 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Em breve publicaremos os primeiros artigos. Enquanto isso, confira a documentação.
            </p>
            <Button asChild variant="outline" className="rounded-xl">
              <Link to="/docs">Ver documentação</Link>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {posts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800/50 flex flex-col"
              >
                {post.cover_image_url && (
                  <img
                    src={post.cover_image_url}
                    alt=""
                    className="w-full h-44 object-cover"
                  />
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <Tag size={12} />
                    <span>{post.category}</span>
                    <span>·</span>
                    <Calendar size={12} className="inline" />
                    <span>{formatDate(post.published_at)}</span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    <Link to={`/blog/${post.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="mt-4 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Ler artigo →
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default PaginaBlog;
