import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, ExternalLink, Globe, Bot, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PortfolioSection = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) {
          console.error('Erro ao buscar portfólio:', error);
          setPortfolioItems([]);
        } else {
          setPortfolioItems(data || []);
        }
      } catch (error) {
        console.error('PortfolioSection: Erro ao buscar portfólio:', error);
        setPortfolioItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const getProjectIcon = (projectType) => {
    switch (projectType) {
      case 'WEB_APP':
        return <Code className="w-6 h-6" />;
      case 'SITE':
        return <Globe className="w-6 h-6" />;
      case 'BOT':
        return <Bot className="w-6 h-6" />;
      default:
        return <Globe className="w-6 h-6" />;
    }
  };

  const getProjectTypeLabel = (projectType) => {
    switch (projectType) {
      case 'WEB_APP':
        return 'Aplicação Web';
      case 'SITE':
        return 'Site Institucional';
      case 'BOT':
        return 'Bot Telegram';
      default:
        return 'Projeto';
    }
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white dark:bg-[var(--dark-bg)]">
        <div className="container mx-auto">
          <div className="flex justify-center items-center py-12 sm:py-16 md:py-20">
            <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-blue-500 dark:text-white animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (portfolioItems.length === 0) {
    return null; // Não mostra a seção se não houver itens
  }

  return (
    <section id="portfolio" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white dark:bg-[var(--dark-bg)] scroll-mt-20">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-gradient px-2">
            Nosso Portfólio
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300/80 max-w-3xl mx-auto px-2 font-medium">
            Conheça alguns dos projetos que desenvolvemos para nossos clientes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white dark:bg-[#111827]/60 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-blue-500/20 hover:border-blue-400 dark:hover:border-blue-500/60 transition-all duration-300 shadow-lg hover:shadow-2xl group"
            >
              {/* Imagem do projeto */}
              {item.image_url && (
                <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-blue-500/10 to-teal-500/10">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {getProjectIcon(item.project_type)}
                      <span>{getProjectTypeLabel(item.project_type)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Conteúdo */}
              <div className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-teal-400 transition-colors">
                  {item.title}
                </h3>
                
                {item.client_name && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Cliente: <span className="font-semibold text-gray-700 dark:text-gray-300">{item.client_name}</span>
                  </p>
                )}

                {item.description && (
                  <p className="text-gray-600 dark:text-gray-300/80 text-sm sm:text-base mb-4 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                )}

                {/* Tecnologias */}
                {item.technologies && item.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.technologies.slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                    {item.technologies.length > 4 && (
                      <span className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                        +{item.technologies.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Link do projeto */}
                {item.project_url && (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full mt-4 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 transition-colors"
                  >
                    <a
                      href={item.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <span>Ver Projeto</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
