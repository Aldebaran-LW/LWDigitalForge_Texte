import React from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Headphones, Zap, Shield, BarChart3, Bot, FileSpreadsheet, Globe, CheckCircle2 } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Clock,
      title: 'Soluções Personalizadas',
      description: 'Desenvolvemos aplicações web e sites sob medida para sua empresa, atendendo suas necessidades específicas e objetivos de negócio.',
      color: '#3B82F6',
      features: ['Desenvolvimento customizado', 'Análise de necessidades', 'Soluções escaláveis']
    },
    {
      icon: TrendingUp,
      title: 'Tecnologias Modernas',
      description: 'Utilizamos as melhores tecnologias e frameworks para criar aplicações web rápidas, seguras e com excelente experiência do usuário.',
      color: '#14B8A6',
      features: ['Stack moderno', 'Performance otimizada', 'UX/UI profissional']
    },
    {
      icon: Headphones,
      title: 'Suporte Especializado e Dedicado',
      description: 'Equipe técnica pronta para ajudar você a maximizar os resultados. Suporte rápido, treinamento personalizado e atualizações constantes.',
      color: '#D946EF',
      features: ['Suporte prioritário', 'Treinamento incluído', 'Atualizações gratuitas']
    },
    {
      icon: Shield,
      title: 'Segurança e Confiabilidade',
      description: 'Seus dados protegidos com criptografia de ponta. Infraestrutura robusta com 99.9% de uptime garantido.',
      color: '#10B981',
      features: ['Criptografia end-to-end', 'Backup automático', 'Conformidade LGPD']
    },
    {
      icon: Zap,
      title: 'Desenvolvimento Ágil',
      description: 'Metodologia ágil de desenvolvimento com entregas incrementais, permitindo acompanhar o progresso e ajustar conforme necessário.',
      color: '#F59E0B',
      features: ['Metodologia ágil', 'Entregas incrementais', 'Acompanhamento contínuo']
    },
    {
      icon: BarChart3,
      title: 'Foco em Resultados',
      description: 'Desenvolvemos soluções que realmente agregam valor ao seu negócio, com foco em resultados mensuráveis e crescimento sustentável.',
      color: '#8B5CF6',
      features: ['Foco em resultados', 'Métricas de sucesso', 'Crescimento sustentável']
    }
  ];

  const productTypes = [
    {
      icon: Globe,
      title: 'Aplicações Web',
      description: 'Sistemas web completos e personalizados para gestão, produtividade e automação de processos empresariais.',
      color: '#3B82F6'
    },
    {
      icon: Globe,
      title: 'Sites Institucionais',
      description: 'Sites modernos e responsivos para empresas, com foco em conversão e experiência do usuário.',
      color: '#14B8A6'
    },
    {
      icon: Bot,
      title: 'Bots Telegram',
      description: 'Automação inteligente para comunicação, vendas e atendimento automatizado via Telegram.',
      color: '#D946EF'
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-b from-white to-[var(--light-bg)] dark:from-[var(--dark-bg)] dark:to-[#0D1117]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-gradient px-2">
            Por que Escolher a LWDigitalForge?
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300/80 max-w-3xl mx-auto px-2 font-medium">
            Desenvolvimento de aplicações web e sites personalizados que realmente fazem a diferença
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white dark:bg-[#111827]/50 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-blue-500/20 hover:border-blue-400 dark:hover:border-blue-500/60 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <motion.div
                whileHover={{ scale: 1.15, rotate: 10 }}
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 sm:mb-6 rounded-full flex items-center justify-center transition-all duration-300 mb-6"
                style={{ 
                  background: `linear-gradient(135deg, ${benefit.color}20, ${benefit.color}10)`,
                  border: `2px solid ${benefit.color}40`
                }}
              >
                <benefit.icon size={36} style={{ color: benefit.color }} />
              </motion.div>

              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4 text-center">
                {benefit.title}
              </h3>
              
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-4 text-center">
                {benefit.description}
              </p>

              <ul className="space-y-2 mt-4">
                {benefit.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle2 size={16} className="mr-2 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Seção de Tipos de Produtos */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="text-center mb-10 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gradient">
              Nossas Especialidades
            </h3>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Três tipos de soluções, uma missão: maximizar sua produtividade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {productTypes.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-[#111827] dark:to-[#0D1117] rounded-xl p-6 sm:p-8 border-2 border-gray-200 dark:border-blue-500/30 hover:border-blue-400 dark:hover:border-blue-500/60 transition-all duration-300"
              >
                <div 
                  className="w-14 h-14 rounded-lg flex items-center justify-center mb-4"
                  style={{ 
                    background: `linear-gradient(135deg, ${product.color}20, ${product.color}10)`,
                  }}
                >
                  <product.icon size={28} style={{ color: product.color }} />
                </div>
                <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                  {product.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {product.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
