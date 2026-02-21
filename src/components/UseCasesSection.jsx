import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ShoppingBag, TrendingUp, Users, FileText, Globe } from 'lucide-react';

const UseCasesSection = () => {
  const useCases = [
    {
      icon: Briefcase,
      title: 'Sistemas de Gestão Empresarial',
      description: 'Aplicações web personalizadas para gestão de processos, controle de estoque, gestão de equipes e automação de rotinas administrativas.',
      benefits: ['Sistemas customizados', 'Integração com processos existentes', 'Automação de rotinas'],
      color: '#3B82F6'
    },
    {
      icon: ShoppingBag,
      title: 'E-commerce e Lojas Virtuais',
      description: 'Plataformas de e-commerce completas e sites para vendas online, com gestão de produtos, pedidos e integração com sistemas de pagamento.',
      benefits: ['Plataforma completa', 'Gestão de produtos', 'Integração com pagamentos'],
      color: '#14B8A6'
    },
    {
      icon: Globe,
      title: 'Sites Institucionais',
      description: 'Sites modernos e responsivos para empresas, com foco em apresentação da marca, serviços e geração de leads qualificados.',
      benefits: ['Design moderno', 'Responsivo e rápido', 'Otimizado para conversão'],
      color: '#D946EF'
    },
    {
      icon: Users,
      title: 'Portais e Áreas do Cliente',
      description: 'Desenvolvemos portais personalizados onde seus clientes podem acessar informações, fazer pedidos e acompanhar serviços.',
      benefits: ['Acesso personalizado', 'Gestão de clientes', 'Experiência diferenciada'],
      color: '#8B5CF6'
    },
    {
      icon: FileText,
      title: 'Sistemas de Relatórios',
      description: 'Aplicações web para geração de relatórios, dashboards executivos e visualização de dados de forma clara e profissional.',
      benefits: ['Dashboards interativos', 'Relatórios automáticos', 'Visualização de dados'],
      color: '#F59E0B'
    },
    {
      icon: TrendingUp,
      title: 'Automação de Processos',
      description: 'Aplicações web que automatizam processos internos, reduzem trabalho manual e aumentam a eficiência operacional da empresa.',
      benefits: ['Redução de trabalho manual', 'Processos otimizados', 'Maior eficiência'],
      color: '#10B981'
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-gradient px-2">
            Soluções para sua Empresa
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300/80 max-w-3xl mx-auto px-2 font-medium">
            Aplicações web e sites desenvolvidos para diferentes necessidades empresariais
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white dark:bg-[#111827]/50 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-blue-500/20 hover:border-blue-400 dark:hover:border-blue-500/60 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group"
            >
              {/* Gradiente de fundo sutil */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ background: useCase.color }}
              />
              
              <div className="relative z-10">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                  style={{ 
                    background: `linear-gradient(135deg, ${useCase.color}20, ${useCase.color}10)`,
                  }}
                >
                  <useCase.icon size={28} style={{ color: useCase.color }} />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-3">
                  {useCase.title}
                </h3>
                
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {useCase.description}
                </p>

                <div className="space-y-2 mt-5 pt-5 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide mb-2">
                    Benefícios Comprovados:
                  </p>
                  {useCase.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start">
                      <div 
                        className="w-1.5 h-1.5 rounded-full mt-2 mr-2 flex-shrink-0"
                        style={{ background: useCase.color }}
                      />
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
