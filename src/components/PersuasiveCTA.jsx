import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Rocket, MessageCircle } from 'lucide-react';

const PersuasiveCTA = () => {
  const items = [
    'Desenvolvimento sob medida para sua empresa',
    'Suporte técnico durante e após o projeto',
    'Tecnologias modernas e escaláveis',
    'Acompanhamento contínuo do projeto',
  ];

  return (
    <section className="py-20 md:py-28 px-6 relative overflow-hidden bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 dark:from-blue-700 dark:via-blue-800 dark:to-violet-900" />

          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Glow orbs */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-violet-400/15 blur-[80px]" />

          {/* Content */}
          <div className="relative z-10 p-10 sm:p-14 md:p-20">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                {/* Left */}
                <div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-white/15 border border-white/25 text-white text-xs font-semibold tracking-wider uppercase"
                  >
                    <Rocket className="w-3.5 h-3.5" />
                    Comece hoje
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4"
                  >
                    Pronto para
                    <br />
                    <span className="text-cyan-300">transformar</span>
                    <br />
                    seu negócio?
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="text-blue-100 text-base leading-relaxed mb-8"
                  >
                    Desenvolvemos aplicações web e sites que transformam processos e impulsionam resultados reais para empresas de todos os tamanhos.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <Button
                      asChild
                      className="bg-white text-blue-700 hover:bg-blue-50 h-12 px-7 rounded-2xl font-bold text-sm shadow-xl hover:shadow-2xl transition-all group"
                    >
                      <Link to="/produtos" className="flex items-center gap-2">
                        Ver Soluções
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>

                    <Button
                      asChild
                      className="bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 h-12 px-7 rounded-2xl font-semibold text-sm transition-all"
                    >
                      <Link to="/contato-orcamento" className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Falar com Especialista
                      </Link>
                    </Button>
                  </motion.div>
                </div>

                {/* Right — checklist */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="space-y-3"
                >
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-5">
                    O que você recebe
                  </p>
                  {items.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15"
                    >
                      <CheckCircle2 className="w-5 h-5 text-cyan-300 flex-shrink-0 mt-0.5" />
                      <span className="text-white text-sm font-medium">{item}</span>
                    </motion.div>
                  ))}

                  {/* Trust line */}
                  <div className="pt-4 flex flex-wrap gap-x-5 gap-y-2">
                    {['Desenvolvimento profissional', 'Tecnologias modernas', 'Foco em resultados'].map((t, i) => (
                      <span key={i} className="text-xs text-blue-200 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-cyan-400 inline-block" />
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PersuasiveCTA;
