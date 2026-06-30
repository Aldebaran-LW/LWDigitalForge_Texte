import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight } from 'lucide-react';
import ContentPageHero from '@/components/content/ContentPageHero';
import { getAllDocs } from '@/lib/docsContent';

const PaginaDocs = () => {
  const docs = getAllDocs();

  const byCategory = useMemo(() => {
    const map = {};
    docs.forEach((doc) => {
      if (!map[doc.category]) map[doc.category] = [];
      map[doc.category].push(doc);
    });
    return map;
  }, [docs]);

  return (
    <>
      <Helmet>
        <title>Documentação — LWDigitalForge</title>
        <meta
          name="description"
          content="Guias do portal LW, StockForge e JornadaPro: primeiros passos, visão geral e boas práticas."
        />
        <link rel="canonical" href="https://www.lwdigitalforge.com/docs" />
      </Helmet>

      <ContentPageHero
        badge="Documentação"
        title="Guias e tutoriais"
        description="Tudo que você precisa para começar com o portal e as aplicações LW."
      />

      <section className="container mx-auto px-6 pb-20 max-w-4xl">
        {Object.entries(byCategory).map(([category, items], ci) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ci * 0.06 }}
            className="mb-10"
          >
            <h2 className="text-sm font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
              <BookOpen size={16} />
              {category}
            </h2>
            <ul className="space-y-3">
              {items.map((doc) => (
                <li key={doc.slug}>
                  <Link
                    to={`/docs/${doc.slug}`}
                    className="group flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800/40 hover:border-blue-300 dark:hover:border-blue-500/40 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {doc.title}
                      </p>
                      {doc.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{doc.description}</p>
                      )}
                    </div>
                    <ChevronRight size={18} className="text-gray-400 shrink-0 group-hover:text-blue-500" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </section>
    </>
  );
};

export default PaginaDocs;
