import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Loader2, Maximize2, Minimize2, ExternalLink, Code2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';

const AdminAplicacoes = () => {
  const { user, session } = useAuth();
  const [apps, setApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);

  // IDs conhecidos das aplicações
  const APP_IDS = {
    JORNADAPRO: 'e8ff7872-dedb-405c-bf8a-f7901ac4b432',
    STOCKFORGE: '0cb79942-0696-4c43-bae4-d2acc46804cd'
  };

  useEffect(() => {
    const fetchApps = async () => {
      try {
        // Buscar apenas JornadaPro e StockForge
        const { data, error } = await supabase
          .from('registered_apps')
          .select('*')
          .in('id', [APP_IDS.JORNADAPRO, APP_IDS.STOCKFORGE])
          .eq('is_active', true)
          .order('name');

        if (error) {
          console.error('Erro ao buscar aplicações:', error);
          return;
        }

        if (data && data.length > 0) {
          setApps(data);
          // Selecionar a primeira aplicação automaticamente
          setSelectedApp(data[0]);
        }
      } catch (error) {
        console.error('Erro ao buscar aplicações:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  // Gerar URL com hash de autenticação
  const generateAppUrl = (app) => {
    if (!app?.vercel_deployment_url || !session?.access_token || !user) {
      return null;
    }

    const authData = {
      access_token: session.access_token,
      user_id: user.id,
      product_id: app.id,
      timestamp: Date.now(),
      from: 'portal'
    };

    const encodedAuth = btoa(JSON.stringify(authData));
    return `${app.vercel_deployment_url}#auth=${encodedAuth}`;
  };

  // Alternar tela cheia
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Abrir em nova aba
  const openInNewTab = (app) => {
    const url = generateAppUrl(app);
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Aplicações - Admin LWDigitalForge</title>
        </Helmet>
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 text-amber-500 animate-spin" />
        </div>
      </>
    );
  }

  if (apps.length === 0) {
    return (
      <>
        <Helmet>
          <title>Aplicações - Admin LWDigitalForge</title>
        </Helmet>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Aplicações Integradas
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Acesse suas aplicações diretamente do portal admin
            </p>
          </div>
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Code2 className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
            <p className="text-gray-600 dark:text-gray-400">
              Nenhuma aplicação configurada no momento.
            </p>
          </div>
        </div>
      </>
    );
  }

  const appUrl = selectedApp ? generateAppUrl(selectedApp) : null;

  return (
    <>
      <Helmet>
        <title>Aplicações - Admin LWDigitalForge</title>
      </Helmet>
      <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-[#0D1526] p-0' : ''}`}>
        {/* Header */}
        {!isFullscreen && (
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Aplicações Integradas
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Acesse JornadaPro e StockForge diretamente do portal admin
            </p>
          </div>
        )}

        <div className={`flex gap-6 ${isFullscreen ? 'h-screen flex-col' : 'flex-col lg:flex-row'}`}>
          {/* Sidebar de Aplicações */}
          {!isFullscreen && (
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-white dark:bg-[#0D1526] rounded-xl border border-gray-200/80 dark:border-white/6 p-4 space-y-2">
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Aplicações Disponíveis
                </h2>
                {apps.map((app) => (
                  <motion.button
                    key={app.id}
                    onClick={() => {
                      setSelectedApp(app);
                      setIframeLoading(true);
                    }}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                      selectedApp?.id === app.id
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25'
                        : 'bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{app.name}</h3>
                        {app.description && (
                          <p className="text-xs mt-1 opacity-80 line-clamp-2">
                            {app.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Área do Iframe */}
          <div className={`flex-1 bg-white dark:bg-[#0D1526] rounded-xl border border-gray-200/80 dark:border-white/6 overflow-hidden flex flex-col ${isFullscreen ? 'h-full' : 'min-h-[600px]'}`}>
            {selectedApp && appUrl ? (
              <>
                {/* Toolbar */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200/80 dark:border-white/6 bg-gray-50/50 dark:bg-white/5">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {selectedApp.name}
                    </h3>
                    {iframeLoading && (
                      <Loader2 className="h-4 w-4 text-amber-500 animate-spin" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openInNewTab(selectedApp)}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Abrir em Nova Aba
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleFullscreen}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      {isFullscreen ? (
                        <>
                          <Minimize2 className="h-4 w-4 mr-2" />
                          Sair da Tela Cheia
                        </>
                      ) : (
                        <>
                          <Maximize2 className="h-4 w-4 mr-2" />
                          Tela Cheia
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Iframe */}
                <div className="flex-1 relative">
                  {iframeLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-[#0D1526] z-10">
                      <div className="text-center">
                        <Loader2 className="h-12 w-12 text-amber-500 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                          Carregando {selectedApp.name}...
                        </p>
                      </div>
                    </div>
                  )}
                  <iframe
                    src={appUrl}
                    className="w-full h-full border-0"
                    title={selectedApp.name}
                    onLoad={() => setIframeLoading(false)}
                    allow="camera; microphone; geolocation; payment; autoplay; encrypted-media"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[600px]">
                <div className="text-center">
                  <Code2 className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Selecione uma aplicação para começar
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminAplicacoes;
