import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Target, Zap, Users, Lightbulb, Globe, CheckCircle2, Rocket, Code2 } from 'lucide-react';

const PaginaSobre = () => {
  const values = [
    {
      icon: Target,
      title: 'Nossa Missão',
      description: 'Democratizar o acesso a soluções digitais de alta qualidade, tornando-as acessíveis para empresas de todos os tamanhos.',
      color: '#3B82F6',
    },
    {
      icon: Zap,
      title: 'Nossa Visão',
      description: 'Ser a principal referência em desenvolvimento de aplicações web e soluções digitais personalizadas no mercado.',
      color: '#06B6D4',
    },
    {
      icon: Users,
      title: 'Nossos Valores',
      description: 'Inovação, transparência, foco no cliente e compromisso com a excelência técnica em cada projeto que entregamos.',
      color: '#7C3AED',
    },
  ];

  const strengths = [
    'Desenvolvimento sob medida para cada cliente',
    'Equipe técnica altamente qualificada',
    'Metodologia ágil com entregas incrementais',
    'Suporte técnico dedicado pós-entrega',
    'Foco em resultados mensuráveis',
    'Tecnologias modernas e escaláveis',
  ];

  const stats = [
    { value: '5+', label: 'Anos de Experiência' },
    { value: '50+', label: 'Projetos Entregues' },
    { value: '100%', label: 'Clientes Satisfeitos' },
    { value: '24/7', label: 'Suporte Dedicado' },
  ];

  return (
    <>
      <Helmet>
        <title>Sobre Nós - LWDigitalForge</title>
        <meta name="description" content="Conheça a história e a missão da LWDigitalForge, sua parceira em desenvolvimento digital." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-28 pb-20 px-6 overflow-hidden bg-gradient-to-b from-[#F0F4FF] to-white dark:from-[#080C14] dark:to-[#0D1526]">
        <div className="absolute inset-0 grid-bg opacity-40 dark:opacity-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-violet-500/6 dark:bg-violet-500/8 blur-[120px] pointer-events-none" />

        <div className="container mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            {/* Text */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wider uppercase"
              >
                <Rocket className="w-3.5 h-3.5" />
                Nossa História
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900 dark:text-white"
              >
                Tecnologia que
                <br />
                <span className="text-gradient">transforma</span>
                <br />
                negócios
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-5"
              >
                A LWDigitalForge nasceu de uma paixão por tecnologia e da busca incessante por eficiência. O que começou como um projeto paralelo — a ideia de automatizar tarefas repetitivas — rapidamente se tornou uma missão.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-8"
              >
                Hoje, somos especialistas em desenvolvimento de aplicações web e sites personalizados, com uma equipe dedicada de desenvolvedores, designers e estrategistas comprometidos em entregar soluções que realmente fazem a diferença.
              </motion.p>

              {/* Strengths */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-2"
              >
                {strengths.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Stats card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative p-8 rounded-3xl bg-white dark:bg-[#0D1526] border border-gray-200/80 dark:border-white/6 shadow-xl">
                <div className="absolute -top-3 -right-3 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg">
                  <Code2 size={24} className="text-white" />
                </div>

                <p className="text-xs font-semibold tracking-widest uppercase text-blue-500 dark:text-blue-400 mb-6">
                  Nossos números
                </p>

                <div className="grid grid-cols-2 gap-6">
                  {stats.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="text-center p-4 rounded-2xl bg-gray-50 dark:bg-white/4 border border-gray-100 dark:border-white/5"
                    >
                      <div className="text-3xl font-bold text-gradient mb-1">{s.value}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Stacked logos placeholder */}
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {['#3B82F6', '#06B6D4', '#7C3AED', '#10B981'].map((c, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#0D1526] flex items-center justify-center text-white text-xs font-bold" style={{ background: c }}>
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    +50 clientes confiam em nós
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="section-divider mb-4" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
              Missão, Visão e <span className="text-gradient">Valores</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Os princípios que guiam cada projeto e decisão que tomamos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group relative p-7 rounded-2xl bg-white dark:bg-[#0D1526] border border-gray-200/80 dark:border-white/6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden text-center"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: `linear-gradient(90deg, transparent, ${v.color}, transparent)` }}
                />

                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${v.color}12`, border: `1px solid ${v.color}25` }}
                >
                  <v.icon size={24} style={{ color: v.color }} />
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{v.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-20 px-6 bg-white dark:bg-[#0D1526]">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-14 items-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-xs font-semibold tracking-widest uppercase text-blue-500 dark:text-blue-400 mb-3">
                Por que nós
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-5 leading-tight">
                A parceria certa para
                <span className="text-gradient"> crescer com tecnologia</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed">
                Acreditamos que a tecnologia deve trabalhar para você — não o contrário. Por isso, desenvolvemos soluções focadas nos seus objetivos, com transparência total em cada etapa do projeto.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Lightbulb, title: 'Inovação', desc: 'Soluções criativas e modernas', color: '#F59E0B' },
                { icon: Globe, title: 'Alcance', desc: 'Soluções para qualquer segmento', color: '#3B82F6' },
                { icon: Zap, title: 'Agilidade', desc: 'Entregas rápidas e eficientes', color: '#06B6D4' },
                { icon: Target, title: 'Resultado', desc: 'Foco em métricas de sucesso', color: '#10B981' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-gray-50 dark:bg-white/4 border border-gray-100 dark:border-white/5"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: `${item.color}12` }}
                  >
                    <item.icon size={18} style={{ color: item.color }} />
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PaginaSobre;
