import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { HeroCarouselPortable } from '@/components/HeroCarouselPortable';
import { Zap, Globe, Shield, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

const HomeHeroSplit = () => {
  const [slides, setSlides] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('lw_home_hero_slides')
          .select('id, image_url, title, subtitle, body_text, href')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (cancelled) return;
        if (error) {
          setSlides([]);
          return;
        }

        const mapped = (data || []).map((row) => ({
          id: row.id,
          image: row.image_url,
          title: row.title || undefined,
          subtitle: row.subtitle || undefined,
          text: row.body_text || undefined,
          href: row.href || undefined,
        }));

        setSlides(mapped);
      } catch {
        if (!cancelled) setSlides([]);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(
    () => [
      { value: '100%', label: 'Personalizado', icon: Zap, color: '#3B82F6' },
      { value: 'Web', label: 'Aplicações Modernas', icon: Globe, color: '#06B6D4' },
      { value: 'B2B', label: 'Soluções Empresariais', icon: TrendingUp, color: '#7C3AED' },
      { value: 'Seguro', label: 'Infraestrutura Robusta', icon: Shield, color: '#10B981' },
    ],
    []
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const hasSlides = Array.isArray(slides) && slides.length > 0;

  return (
    <section className="relative overflow-hidden">
      {/* Fundo igual ao HeroSection atual */}
      <div className="absolute inset-0 bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]" />
      <div className="absolute inset-0 grid-bg opacity-100 dark:opacity-100" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[800px] h-[600px] rounded-full bg-blue-500/10 dark:bg-blue-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/8 dark:bg-cyan-500/12 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-violet-500/6 dark:bg-violet-500/10 blur-[80px] pointer-events-none" />

      <div className="relative mx-auto max-w-[1600px] px-4 pb-16 pt-28 md:px-8 lg:pb-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Texto — esquerda fixa */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-w-0"
          >
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold tracking-wider uppercase">
                  Soluções Web para Empresas
                </span>
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] tracking-tight mb-6 text-left"
            >
              <span className="text-gray-900 dark:text-white">Aplicações Web</span>
              <br />
              <span className="text-gradient">que Transformam</span>
              <br />
              <span className="text-gray-900 dark:text-white">seu Negócio</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-10 leading-relaxed text-left"
            >
              Desenvolvemos{' '}
              <span className="text-blue-600 dark:text-blue-400 font-semibold">aplicações web modernas</span>,{' '}
              <span className="text-cyan-600 dark:text-cyan-400 font-semibold">sites institucionais</span> e{' '}
              <span className="text-violet-600 dark:text-violet-400 font-semibold">sistemas personalizados</span>{' '}
              que automatizam processos e geram resultados reais.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Button
                asChild
                className="btn-primary group w-full sm:w-auto h-14 px-8 text-base font-semibold rounded-2xl pulse-glow shadow-lg"
              >
                <Link to="/produtos" className="flex items-center gap-2">
                  Explorar Soluções
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                asChild
                className="btn-secondary w-full sm:w-auto h-14 px-8 text-base font-semibold rounded-2xl"
              >
                <Link to="/contato-orcamento">Falar com Especialista</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Carrossel — direita */}
          <motion.div
            initial={{ opacity: 0, x: 26 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="min-w-0 lg:ml-auto lg:-mr-4 xl:-mr-8 2xl:-mr-12"
          >
            {hasSlides ? (
              <HeroCarouselPortable
                slides={slides}
                autoPlayInterval={5000}
                embedded
                variant="split"
              />
            ) : (
              <div className="min-h-[240px] w-full rounded-3xl border border-slate-100 bg-slate-50 dark:border-white/10 dark:bg-slate-900/40" />
            )}
          </motion.div>
        </div>

        {/* Stats — largura total, centralizado na página */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-10 w-full lg:mt-14"
        >
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="relative group overflow-hidden rounded-2xl border-2 bg-white/80 p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-xl dark:bg-white/5 sm:p-5"
                style={{
                  borderColor: `${stat.color}30`,
                }}
              >
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${stat.color}12, transparent 70%)`,
                    opacity: 1,
                  }}
                />
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${stat.color}40, transparent 70%)`,
                  }}
                />
                <div
                  className="absolute left-0 right-0 top-0 h-1 opacity-60 transition-opacity group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`,
                  }}
                />
                <div className="relative z-10">
                  <stat.icon
                    className="mb-3 h-6 w-6 transition-transform duration-300 group-hover:scale-110"
                    style={{ color: stat.color }}
                  />
                  <div className="mb-0.5 text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium leading-tight text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeHeroSplit;

