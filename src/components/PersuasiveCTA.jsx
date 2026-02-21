import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const PersuasiveCTA = () => {
  const guarantees = [
    'Desenvolvimento sob medida para sua empresa',
    'Suporte técnico durante e após o desenvolvimento',
    'Tecnologias modernas e escaláveis',
    'Acompanhamento contínuo do projeto'
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 dark:from-blue-800 dark:via-blue-900 dark:to-teal-800 relative overflow-hidden">
      {/* Efeitos de fundo */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/20 backdrop-blur-sm border border-white/30"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">
              Oferta Especial - Comece Hoje
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight"
          >
            Pronto para Transformar
            <br />
            <span className="text-teal-200">Sua Produtividade?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Desenvolvemos aplicações web e sites personalizados que 
            <strong className="text-white"> transformam processos</strong> e 
            <strong className="text-white"> impulsionam resultados</strong> para empresas de todos os tamanhos
          </motion.p>

          {/* Garantias */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-10 max-w-2xl mx-auto"
          >
            {guarantees.map((guarantee, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-2 text-left bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20"
              >
                <CheckCircle2 className="w-5 h-5 text-teal-300 flex-shrink-0" />
                <span className="text-sm sm:text-base text-white font-medium">
                  {guarantee}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              asChild 
              className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-bold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 min-h-[56px] group"
            >
              <Link to="/produtos" className="flex items-center gap-2">
                <span>Ver Todas as Soluções</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-semibold rounded-lg backdrop-blur-sm min-h-[56px]"
            >
              <Link to="/contato-orcamento">
                Falar com Especialista
              </Link>
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            viewport={{ once: true }}
            className="mt-12 pt-8 border-t border-white/20"
          >
            <p className="text-sm text-blue-100 mb-4">
              ✅ Desenvolvimento profissional e personalizado
            </p>
            <p className="text-sm text-blue-100">
              ✅ Tecnologias modernas • ✅ Foco em resultados para sua empresa
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PersuasiveCTA;
