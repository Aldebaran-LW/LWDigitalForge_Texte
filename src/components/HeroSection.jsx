import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getAssetUrl } from '@/config/assets';
import { Zap, Globe, Shield, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const stats = [
    { value: '100%', label: 'Personalizado', icon: Zap, color: '#3B82F6' },
    { value: 'Web', label: 'Aplicações Modernas', icon: Globe, color: '#06B6D4' },
    { value: 'B2B', label: 'Soluções Empresariais', icon: TrendingUp, color: '#7C3AED' },
    { value: 'Seguro', label: 'Infraestrutura Robusta', icon: Shield, color: '#10B981' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-bg opacity-100 dark:opacity-100" />

      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={getAssetUrl('Capa')}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-[0.04] dark:opacity-[0.07] mix-blend-luminosity"
        />
      </div>

      {/* Radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[800px] h-[600px] rounded-full bg-blue-500/10 dark:bg-blue-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/8 dark:bg-cyan-500/12 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-violet-500/6 dark:bg-violet-500/10 blur-[80px] pointer-events-none" />

      {/* Fade bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--light-bg)] dark:from-[var(--dark-bg)] to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-8 pt-28 pb-20 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold tracking-wider uppercase">
                Soluções Web para Empresas
              </span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6"
          >
            <span className="text-gray-900 dark:text-white">Aplicações Web</span>
            <br />
            <span className="text-gradient">que Transformam</span>
            <br />
            <span className="text-gray-900 dark:text-white">seu Negócio</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Desenvolvemos{' '}
            <span className="text-blue-600 dark:text-blue-400 font-semibold">aplicações web modernas</span>,{' '}
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">sites institucionais</span> e{' '}
            <span className="text-violet-600 dark:text-violet-400 font-semibold">sistemas personalizados</span>{' '}
            que automatizam processos e geram resultados reais.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
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
              <Link to="/contato-orcamento">
                💬 Falar com Especialista
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="relative group overflow-hidden rounded-2xl bg-white/80 dark:bg-white/5 border-2 backdrop-blur-md p-4 sm:p-5 shadow-sm hover:shadow-xl transition-all duration-300"
                style={{
                  borderColor: `${stat.color}30`,
                }}
              >
                {/* Background gradient - sempre visível mas mais intenso no hover */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${stat.color}12, transparent 70%)`,
                    opacity: 1,
                  }}
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${stat.color}40, transparent 70%)`,
                  }}
                />
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`,
                  }}
                />
                <div className="relative z-10">
                  <stat.icon
                    className="w-6 h-6 mb-3 mx-auto transition-transform duration-300 group-hover:scale-110"
                    style={{ color: stat.color }}
                  />
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-0.5">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 leading-tight font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
