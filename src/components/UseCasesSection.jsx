import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Briefcase, ShoppingBag, TrendingUp, Users, FileText, Globe, ChevronLeft, ChevronRight } from 'lucide-react';

const UseCasesSection = () => {
  const useCases = [
    {
      icon: Briefcase,
      title: 'Sistemas de Gestão',
      description: 'Aplicações web para gestão de processos, controle de estoque e automação de rotinas administrativas.',
      benefits: ['Sistemas customizados', 'Integração com processos', 'Automação de rotinas'],
      color: '#3B82F6',
      number: '01',
    },
    {
      icon: ShoppingBag,
      title: 'E-commerce e Lojas Virtuais',
      description: 'Plataformas de e-commerce completas com gestão de produtos, pedidos e integração com pagamentos.',
      benefits: ['Plataforma completa', 'Gestão de produtos', 'Integração pagamentos'],
      color: '#06B6D4',
      number: '02',
    },
    {
      icon: Globe,
      title: 'Sites Institucionais',
      description: 'Sites modernos e responsivos para empresas, com foco em apresentação da marca e geração de leads.',
      benefits: ['Design moderno', 'Responsivo e rápido', 'Otimizado para conversão'],
      color: '#7C3AED',
      number: '03',
    },
    {
      icon: Users,
      title: 'Portais do Cliente',
      description: 'Portais personalizados onde seus clientes podem acessar informações, fazer pedidos e acompanhar serviços.',
      benefits: ['Acesso personalizado', 'Gestão de clientes', 'Experiência diferenciada'],
      color: '#EC4899',
      number: '04',
    },
    {
      icon: FileText,
      title: 'Sistemas de Relatórios',
      description: 'Aplicações web para geração de relatórios, dashboards executivos e visualização de dados.',
      benefits: ['Dashboards interativos', 'Relatórios automáticos', 'Visualização de dados'],
      color: '#F59E0B',
      number: '05',
    },
    {
      icon: TrendingUp,
      title: 'Automação de Processos',
      description: 'Aplicações que automatizam processos internos, reduzem trabalho manual e aumentam a eficiência.',
      benefits: ['Redução de trabalho manual', 'Processos otimizados', 'Maior eficiência'],
      color: '#10B981',
      number: '06',
    },
  ];

  // Duplica os cards para permitir um "loop infinito" visualmente contínuo.
  const useCasesLoop = [...useCases, ...useCases];

  const scrollRef = useRef(null);
  const carouselRegionRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const [isCarouselVisible, setIsCarouselVisible] = useState(false);

  const isAutoPausedRef = useRef(false);
  const pauseTimerRef = useRef(null);

  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);

  const isUserScrollingRef = useRef(false);
  const userScrollTimeoutRef = useRef(null);

  const pauseAuto = (ms = 3000) => {
    if (reducedMotion) return;
    isAutoPausedRef.current = true;
    if (pauseTimerRef.current) window.clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = window.setTimeout(() => {
      isAutoPausedRef.current = false;
    }, ms);
  };

  const handleUserScroll = (ms = 2500) => {
    if (reducedMotion) return;
    isUserScrollingRef.current = true;
    pauseAuto(ms);
    if (userScrollTimeoutRef.current) window.clearTimeout(userScrollTimeoutRef.current);
    userScrollTimeoutRef.current = window.setTimeout(() => {
      isUserScrollingRef.current = false;
    }, 900);
  };

  const scrollByCards = (dir) => {
    if (!scrollRef.current) return;
    pauseAuto(3500);
    const amount = scrollRef.current.clientWidth * 0.85 * dir;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (reducedMotion) return;
    if (!isCarouselVisible) return;

    let rafId;
    let lastTs = performance.now();
    const pxPerSecond = 85;

    const step = (ts) => {
      const dtMs = ts - lastTs;
      lastTs = ts;

      if (!isAutoPausedRef.current) {
        if (isDraggingRef.current) {
          rafId = window.requestAnimationFrame(step);
          return;
        }

        if (isUserScrollingRef.current) {
          rafId = window.requestAnimationFrame(step);
          return;
        }

        const half = el.scrollWidth / 2;
        if (half > 1) {
          el.scrollLeft += (pxPerSecond * dtMs) / 1000;
          if (el.scrollLeft >= half - 2) el.scrollLeft -= half;
        }
      }

      rafId = window.requestAnimationFrame(step);
    };

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [reducedMotion, isCarouselVisible]);

  useEffect(() => {
    const region = carouselRegionRef.current;
    if (!region) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setIsCarouselVisible(entry.isIntersecting);
      },
      { threshold: [0, 0.1, 0.25] }
    );

    observer.observe(region);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 md:py-28 px-6 bg-[var(--light-bg)] dark:bg-[var(--dark-bg)] relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="section-divider mb-4" />
          <p className="text-xs font-semibold tracking-widest uppercase text-blue-500 dark:text-blue-400 mb-3">
            Casos de uso
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            Soluções para cada
            <br />
            <span className="text-gradient">necessidade</span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Aplicações web desenvolvidas para diferentes segmentos e necessidades empresariais
          </p>
        </motion.div>

        {/* Cards carousel */}
        <div ref={carouselRegionRef} className="relative">
          <button
            type="button"
            aria-label="Rolagem para esquerda"
            onClick={() => scrollByCards(-1)}
            className="hidden sm:flex absolute left-1 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-10 h-10 rounded-full border border-gray-200/80 dark:border-white/10 bg-white/70 dark:bg-[#0D1526]/70 shadow-sm hover:shadow transition-all duration-200 backdrop-blur"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            aria-label="Rolagem para direita"
            onClick={() => scrollByCards(1)}
            className="hidden sm:flex absolute right-1 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-10 h-10 rounded-full border border-gray-200/80 dark:border-white/10 bg-white/70 dark:bg-[#0D1526]/70 shadow-sm hover:shadow transition-all duration-200 backdrop-blur"
          >
            <ChevronRight size={18} />
          </button>

          <div
            ref={scrollRef}
            role="region"
            aria-label="Lista de casos de uso"
            className="flex gap-5 overflow-x-auto scroll-smooth px-1 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => {
              if (!scrollRef.current) return;
              pauseAuto(8000);
              isDraggingRef.current = true;
              dragStartXRef.current = e.clientX;
              dragStartScrollLeftRef.current = scrollRef.current.scrollLeft;
              scrollRef.current.setPointerCapture?.(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!isDraggingRef.current || !scrollRef.current) return;
              const dx = e.clientX - dragStartXRef.current;
              scrollRef.current.scrollLeft = dragStartScrollLeftRef.current - dx;
            }}
            onPointerUp={() => {
              isDraggingRef.current = false;
              pauseAuto(1200);
            }}
            onPointerCancel={() => {
              isDraggingRef.current = false;
              pauseAuto(1200);
            }}
            onMouseEnter={() => pauseAuto(1200)}
            onWheel={() => handleUserScroll(3000)}
          >
            {useCasesLoop.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (i % useCases.length) * 0.07, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                whileHover={{
                  y: -4,
                  scale: 1.02,
                  transition: { type: 'spring', stiffness: 400, damping: 20 },
                }}
                className="group relative shrink-0 w-[320px] sm:w-[360px] lg:w-[380px] p-6 rounded-2xl bg-white dark:bg-[#0D1526] border border-gray-200/80 dark:border-white/6 shadow-sm hover:shadow-lg dark:hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden"
              >
              {/* Corner number */}
              <div
                className="absolute top-5 right-5 text-5xl font-black leading-none opacity-5 group-hover:opacity-10 transition-opacity select-none"
                style={{ color: item.color }}
              >
                {item.number}
              </div>

              {/* Subtle top glow on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `linear-gradient(180deg, ${item.color}08, transparent)` }}
              />

              {/* Conteúdo à esquerda e ícone à direita */}
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 pr-10">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5">
                    {item.description}
                  </p>

                  {/* Benefits */}
                  <div className="pt-4 border-t border-gray-100 dark:border-white/5 space-y-1.5">
                    {item.benefits.map((b, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: item.color }}
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${item.color}12`,
                    border: `1px solid ${item.color}25`,
                  }}
                >
                  <item.icon size={20} style={{ color: item.color }} />
                </div>
              </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
