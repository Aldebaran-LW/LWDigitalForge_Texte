import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, ExternalLink, Globe, Bot, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PaginaPortfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('TODOS');

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        // Se filtrar por WEB_APP, não buscar do portfolio
        if (filter === 'WEB_APP') {
          setPortfolioItems([]);
          return;
        }

        let query = supabase
          .from('portfolio')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (filter !== 'TODOS') {
          query = query.eq('project_type', filter);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Erro ao buscar portfólio:', error);
          setPortfolioItems([]);
        } else {
          setPortfolioItems(data || []);
        }
      } catch (error) {
        console.error('PaginaPortfolio: Erro ao buscar portfólio:', error);
        setPortfolioItems([]);
      }
    };

    const fetchApplications = async () => {
      try {
        // Buscar aplicações apenas se o filtro for TODOS ou WEB_APP
        if (filter === 'TODOS' || filter === 'WEB_APP') {
          const { data, error } = await supabase
            .from('registered_apps')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Erro ao buscar aplicações:', error);
            setApplications([]);
          } else {
            setApplications(data || []);
          }
        } else {
          setApplications([]);
        }
      } catch (error) {
        console.error('PaginaPortfolio: Erro ao buscar aplicações:', error);
        setApplications([]);
      }
    };

    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchPortfolio(), fetchApplications()]);
      setLoading(false);
    };

    fetchAll();
  }, [filter]);

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

  const filters = [
    { value: 'TODOS', label: 'Todos' },
    { value: 'WEB_APP', label: 'Aplicações Web' },
    { value: 'SITE', label: 'Sites' },
    { value: 'BOT', label: 'Bots' },
  ];

  // Combinar portfolio items e applications baseado no filtro
  const getDisplayItems = () => {
    if (filter === 'TODOS') {
      // Combinar tudo
      const portfolioWithType = portfolioItems.map(item => ({ ...item, source: 'portfolio' }));
      const appsWithType = applications.map(app => ({ ...app, source: 'app', project_type: 'WEB_APP' }));
      return [...portfolioWithType, ...appsWithType];
    } else if (filter === 'WEB_APP') {
      // Apenas aplicações web
      return applications.map(app => ({ ...app, source: 'app', project_type: 'WEB_APP' }));
    } else {
      // Apenas portfolio filtrado
      return portfolioItems.map(item => ({ ...item, source: 'portfolio' }));
    }
  };

  const displayItems = getDisplayItems();

  return (
    <>
      <Helmet>
        <title>Portfólio - LWDigitalForge</title>
        <meta 
          name="description" 
          content="Conheça os projetos que desenvolvemos para nossos clientes. Aplicações web, sites institucionais e bots Telegram personalizados." 
        />
      </Helmet>
      
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[var(--light-bg)] dark:bg-[var(--dark-bg)] min-h-screen">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 sm:mb-12 md:mb-16"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-gradient px-2">
              Nosso Portfólio
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300/80 max-w-3xl mx-auto px-2 font-medium">
              Conheça os projetos que desenvolvemos para nossos clientes
            </p>
          </motion.div>

          {/* Filtros */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10 sm:mb-12"
          >
            {filters.map((filterOption) => (
              <button
                key={filterOption.value}
                onClick={() => setFilter(filterOption.value)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 min-h-[44px] ${
                  filter === filterOption.value
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-12 sm:py-16 md:py-20">
              <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-blue-500 dark:text-white animate-spin" />
            </div>
          ) : displayItems.length === 0 ? (
            <div className="text-center py-12 sm:py-16 md:py-20">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Nenhum projeto encontrado nesta categoria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayItems.map((item, index) => {
                // Determinar se é aplicação ou portfolio item
                const isApp = item.source === 'app';
                const title = isApp ? item.name : item.title;
                const description = isApp ? item.description : item.description;
                const imageUrl = isApp ? item.image_url : item.image_url;
                const projectUrl = isApp ? item.vercel_deployment_url : item.project_url;
                const clientName = isApp ? null : item.client_name;
                const technologies = isApp ? (item.features || []) : (item.technologies || []);
                const projectType = isApp ? 'WEB_APP' : item.project_type;
                
                return (
                 <motion.div
                   key={item.id}
                   initial={{ opacity: 0, y: 50 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.4, delay: index * 0.1 }}
                   whileHover={{ y: -8, scale: 1.02 }}
                   className="bg-white dark:bg-[#111827]/60 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-blue-500/20 hover:border-blue-400 dark:hover:border-blue-500/60 transition-all duration-300 shadow-lg hover:shadow-2xl group"
                 >
                   {/* Imagem do projeto */}
                   {imageUrl && (
                     <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-blue-500/10 to-teal-500/10">
                       <img
                         src={imageUrl}
                         alt={title}
                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                         onError={(e) => {
                           e.target.style.display = 'none';
                         }}
                       />
                       <div className="absolute top-4 right-4">
                         <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                           {getProjectIcon(projectType)}
                           <span>{getProjectTypeLabel(projectType)}</span>
                         </div>
                       </div>
                     </div>
                   )}

                   {/* Conteúdo */}
                   <div className="p-6 sm:p-8">
                     <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-teal-400 transition-colors">
                       {title}
                     </h3>
                     
                     {clientName && (
                       <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                         Cliente: <span className="font-semibold text-gray-700 dark:text-gray-300">{clientName}</span>
                       </p>
                     )}

                     {description && (
                       <p className="text-gray-600 dark:text-gray-300/80 text-sm sm:text-base mb-4 leading-relaxed line-clamp-3">
                         {description}
                       </p>
                     )}

                     {/* Tecnologias/Features */}
                     {technologies && technologies.length > 0 && (
                       <div className="flex flex-wrap gap-2 mb-4">
                         {technologies.slice(0, 4).map((tech, idx) => (
                           <span
                             key={idx}
                             className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md"
                           >
                             {tech}
                           </span>
                         ))}
                         {technologies.length > 4 && (
                           <span className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                             +{technologies.length - 4}
                           </span>
                         )}
                       </div>
                     )}

                     {/* Preço (apenas para aplicações) */}
                     {isApp && item.price_monthly && (
                       <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                         <div className="text-lg font-bold text-teal-500 dark:text-teal-400">
                           R$ {(item.price_monthly / 100).toFixed(2).replace('.', ',')}
                           <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/mês</span>
                         </div>
                       </div>
                     )}

                     {/* Links */}
                     <div className="flex gap-2 mt-4">
                       {projectUrl && (
                         <Button
                           asChild
                           variant="outline"
                           className="flex-1 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 transition-colors"
                         >
                           <a
                             href={projectUrl}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="flex items-center justify-center gap-2"
                           >
                             <span>{isApp ? 'Ver App' : 'Ver Projeto'}</span>
                             <ExternalLink className="w-4 h-4" />
                           </a>
                         </Button>
                       )}
                       {isApp && (
                         <Button
                           asChild
                           variant="outline"
                           className="flex-1 group-hover:bg-teal-500 group-hover:text-white group-hover:border-teal-500 transition-colors"
                         >
                           <a
                             href={`/product/${item.id}`}
                             className="flex items-center justify-center gap-2"
                           >
                             <span>Detalhes</span>
                           </a>
                         </Button>
                       )}
                     </div>
                   </div>
                 </motion.div>
               );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default PaginaPortfolio;
