import React from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Headphones, Zap, Shield, BarChart3, Globe, Bot, CheckCircle2, Code2 } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Clock,
      title: 'Soluções Personalizadas',
      description: 'Desenvolvemos aplicações web e sites sob medida para sua empresa, atendendo necessidades específicas e objetivos de negócio.',
      color: '#3B82F6',
      features: ['Desenvolvimento customizado', 'Análise de necessidades', 'Soluções escaláveis'],
      size: 'normal',
    },
    {
      icon: TrendingUp,
      title: 'Tecnologias Modernas',
      description: 'Utilizamos os melhores frameworks para criar aplicações web rápidas, seguras e com excelente experiência do usuário.',
      color: '#06B6D4',
      features: ['Stack moderno', 'Performance otimizada', 'UX/UI profissional'],
      size: 'normal',
    },
    {
      icon: Headphones,
      title: 'Suporte Dedicado',
      description: 'Equipe técnica pronta para ajudar você a maximizar os resultados. Suporte rápido e atualizações constantes.',
      color: '#7C3AED',
      features: ['Suporte prioritário', 'Treinamento incluído', 'Atualizações gratuitas'],
      size: 'normal',
    },
    {
      icon: Shield,
      title: 'Segurança e Confiabilidade',
      description: 'Seus dados protegidos com criptografia de ponta. Infraestrutura robusta com uptime garantido.',
      color: '#10B981',
      features: ['Criptografia end-to-end', 'Backup automático', 'Conformidade LGPD'],
      size: 'normal',
    },
    {
      icon: Zap,
      title: 'Desenvolvimento Ágil',
      description: 'Metodologia ágil com entregas incrementais, permitindo acompanhar o progresso e ajustar conforme necessário.',
      color: '#F59E0B',
      features: ['Metodologia ágil', 'Entregas incrementais', 'Acompanhamento contínuo'],
      size: 'normal',
    },
    {
      icon: BarChart3,
      title: 'Foco em Resultados',
      description: 'Desenvolvemos soluções que realmente agregam valor ao seu negócio, com foco em resultados mensuráveis.',
      color: '#EC4899',
      features: ['Foco em resultados', 'Métricas de sucesso', 'Crescimento sustentável'],
      size: 'normal',
    },
  ];

  const specialties = [
    {
      icon: Globe,
      title: 'Aplicações Web',
      description: 'Sistemas web completos e personalizados para gestão, produtividade e automação de processos empresariais.',
      color: '#3B82F6',
      stat: '∞',
      statLabel: 'Possibilidades',
    },
    {
      icon: Code2,
      title: 'Sites Institucionais',
      description: 'Sites modernos e responsivos para empresas, com foco em conversão e experiência do usuário.',
      color: '#06B6D4',
      stat: 'Fast',
      statLabel: 'Carregamento',
    },
    {
      icon: Bot,
      title: 'Bots Telegram',
      description: 'Automação inteligente para comunicação, vendas e atendimento automatizado via Telegram.',
      color: '#7C3AED',
      stat: '24/7',
      statLabel: 'Disponível',
    },
  ];

  return (
    <section className="py-20 md:py-28 px-6 bg-gradient-to-b from-white to-[var(--light-bg)] dark:from-[#0D1526] dark:to-[var(--dark-bg)] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 grid-bg opacity-50 dark:opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-500/5 dark:bg-violet-500/8 blur-[120px] pointer-events-none" />

      <div className="container mx-auto relative z-10">
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
            Por que nos escolher
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            Diferenciais que fazem
            <br />
            <span className="text-gradient">toda a diferença</span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Mais que tecnologia — entregamos resultados reais que transformam como sua empresa opera
          </p>
        </motion.div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="group relative p-6 rounded-2xl bg-white dark:bg-[#0D1526] border border-gray-200/80 dark:border-white/6 shadow-sm hover:shadow-lg dark:hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden"
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at 0% 0%, ${benefit.color}08, transparent 60%)` }}
              />

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${benefit.color}18, ${benefit.color}08)`,
                  border: `1px solid ${benefit.color}25`,
                }}
              >
                <benefit.icon size={22} style={{ color: benefit.color }} />
              </div>

              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                {benefit.description}
              </p>

              <ul className="space-y-1.5">
                {benefit.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Bottom accent */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${benefit.color}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>

        {/* Specialties */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-10">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Nossas <span className="text-gradient">Especialidades</span>
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Três tipos de soluções, uma missão: maximizar sua produtividade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {specialties.map((spec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group relative p-6 rounded-2xl border-2 border-gray-200/80 dark:border-white/6 bg-white dark:bg-[#0D1526] overflow-hidden transition-all duration-300 hover:border-opacity-60"
                style={{ '--border-color': spec.color }}
              >
                {/* Gradient top accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: `linear-gradient(90deg, ${spec.color}, ${spec.color}60)` }}
                />

                {/* Stat badge */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: `${spec.color}15`, border: `1px solid ${spec.color}25` }}
                  >
                    <spec.icon size={20} style={{ color: spec.color }} />
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold" style={{ color: spec.color }}>{spec.stat}</div>
                    <div className="text-xs text-gray-400">{spec.statLabel}</div>
                  </div>
                </div>

                <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">{spec.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{spec.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
