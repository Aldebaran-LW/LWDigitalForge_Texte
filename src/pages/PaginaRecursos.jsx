import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, FileText, ArrowRight } from 'lucide-react';
import ContentPageHero from '@/components/content/ContentPageHero';
import { Button } from '@/components/ui/button';

const cards = [
  {
    to: '/blog',
    icon: FileText,
    title: 'Blog',
    description: 'Artigos sobre transformação digital, produtos e cases para atrair e educar seu público.',
    cta: 'Ver artigos',
  },
  {
    to: '/docs',
    icon: BookOpen,
    title: 'Documentação',
    description: 'Guias práticos do portal, StockForge e JornadaPro para começar rápido e com segurança.',
    cta: 'Abrir guias',
  },
];

const PaginaRecursos = () => (
  <>
    <Helmet>
      <title>Recursos — Blog e Documentação | LWDigitalForge</title>
      <meta
        name="description"
        content="Blog e documentação LW Digital Forge: conteúdo para SEO, educação e suporte aos produtos."
      />
      <link rel="canonical" href="https://www.lwdigitalforge.com/recursos" />
    </Helmet>

    <ContentPageHero
      badge="Recursos"
      title="Conteúdo que gera confiança"
      description="Explore artigos do blog e a documentação dos nossos produtos. Tudo pensado para quem está conhecendo ou já usa a plataforma."
    />

    <section className="container mx-auto px-6 pb-20 -mt-4">
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {cards.map((card, i) => (
          <motion.div
            key={card.to}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800/50 p-8 shadow-sm hover:shadow-lg transition-shadow"
          >
            <card.icon className="h-10 w-10 text-blue-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{card.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{card.description}</p>
            <Button asChild className="btn-primary rounded-xl">
              <Link to={card.to} className="flex items-center gap-2">
                {card.cta}
                <ArrowRight size={16} />
              </Link>
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">Quer uma solução sob medida?</p>
        <Button asChild variant="outline" className="rounded-xl">
          <Link to="/contato-orcamento">Solicitar orçamento</Link>
        </Button>
      </div>
    </section>
  </>
);

export default PaginaRecursos;
