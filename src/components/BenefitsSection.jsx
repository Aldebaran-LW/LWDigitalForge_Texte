
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Headphones } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Clock,
      title: 'Economize Seu Tempo',
      description: 'Nossas ferramentas automatizam tarefas repetitivas para que você possa focar no que realmente importa.',
      color: '#3B82F6' // Primary Blue
    },
    {
      icon: TrendingUp,
      title: 'Decisões Baseadas em Dados',
      description: 'Transforme dados complexos em insights claros com nossas planilhas inteligentes.',
      color: '#14B8A6' // Accent Turquoise
    },
    {
      icon: Headphones,
      title: 'Suporte Especializado',
      description: 'Conte com nosso suporte para garantir o melhor uso das ferramentas e acesso simplificado.',
      color: '#D946EF' // Accent Magenta
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white dark:bg-dark-bg">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gradient px-2">
            Por que Escolher a LWDigitalForge?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300/80 max-w-3xl mx-auto px-2">
            Somos especialistas em criar soluções que realmente fazem a diferença no seu dia a dia.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="text-center group p-4 sm:p-5 md:p-6 rounded-xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-5 md:mb-6 rounded-full flex items-center justify-center border-2 border-transparent transition-all duration-300"
                style={{ background: `${benefit.color}1A`, color: benefit.color }} // e.g., #3B82F61A for 10% opacity
              >
                <benefit.icon size={32} className="sm:w-10 sm:h-10" />
              </motion.div>

              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4">
                {benefit.title}
              </h3>
              
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm mx-auto">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
