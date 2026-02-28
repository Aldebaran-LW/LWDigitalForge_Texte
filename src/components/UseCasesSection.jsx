import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ShoppingBag, TrendingUp, Users, FileText, Globe } from 'lucide-react';

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

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {useCases.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group relative p-6 rounded-2xl bg-white dark:bg-[#0D1526] border border-gray-200/80 dark:border-white/6 shadow-sm hover:shadow-xl dark:hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden"
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

              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `${item.color}12`,
                  border: `1px solid ${item.color}25`,
                }}
              >
                <item.icon size={20} style={{ color: item.color }} />
              </div>

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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
