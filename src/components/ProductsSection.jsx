
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, TestTube2, ArrowRight, Star, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { startProductTrial } from '@/utils/trialHelpers';

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startingTrials, setStartingTrials] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('registered_apps')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(4);

        if (error) {
          console.error('Erro ao buscar produtos:', error);
          setProducts([]);
        } else {
          setProducts(data || []);
        }
      } catch (error) {
        console.error('ProductsSection: Erro ao buscar produtos:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (priceInCents) => {
    if (!priceInCents) return 'Consulte valores';
    return `R$ ${(priceInCents / 100).toFixed(2).replace('.', ',')}`;
  };

  const handleStartTrial = async (product) => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login ou cadastre-se para iniciar o teste grátis.",
      });
      navigate('/login');
      return;
    }

    setStartingTrials(prev => ({ ...prev, [product.id]: true }));

    try {
      const result = await startProductTrial(
        user.id,
        product.id,
        product.name,
        product.trial_period_days || 30,
        user.email
      );

      if (result.success) {
        toast({
          title: "Teste Iniciado!",
          description: `Você tem ${product.trial_period_days} dias para testar ${product.name}.`,
        });
        if (result.redirectUrl) {
          setTimeout(() => window.open(result.redirectUrl, '_blank'), 1500);
        }
      } else {
        if (result.redirectUrl) {
          toast({ title: "Você já tem acesso!", description: "Redirecionando..." });
          setTimeout(() => window.open(result.redirectUrl, '_blank'), 1000);
        } else {
          toast({ variant: "destructive", title: "Erro", description: result.message || "Não foi possível iniciar o teste." });
        }
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível iniciar o teste." });
    } finally {
      setStartingTrials(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const cardColors = [
    { from: '#2563EB', to: '#06B6D4' },
    { from: '#7C3AED', to: '#2563EB' },
    { from: '#059669', to: '#06B6D4' },
    { from: '#D97706', to: '#7C3AED' },
  ];

  return (
    <section className="py-20 md:py-28 px-6 bg-[var(--light-bg)] dark:bg-[var(--dark-bg)] relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      <div className="container mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="section-divider mb-4" />
          <p className="text-xs font-semibold tracking-widest uppercase text-blue-500 dark:text-blue-400 mb-3">
            Nossas Soluções
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            Aplicações{' '}
            <span className="text-gradient">Desenvolvidas</span>
            <br />para Empresas
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Soluções web personalizadas que automatizam, organizam e impulsionam resultados reais
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="text-sm text-gray-400">Carregando soluções...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>Nenhum produto disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {products.map((product, index) => {
              const color = cardColors[index % cardColors.length];
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6 }}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="group relative cursor-pointer"
                >
                  {/* Card */}
                  <div className="relative h-full flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-[#0D1526] border border-gray-200/80 dark:border-white/6 shadow-sm hover:shadow-xl dark:hover:shadow-blue-500/5 transition-all duration-400">
                    {/* Top accent bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[2px] opacity-70 group-hover:opacity-100 transition-opacity"
                      style={{ background: `linear-gradient(90deg, ${color.from}, ${color.to})` }}
                    />

                    {/* Product image */}
                    {product.image_url && (
                      <div className="relative overflow-hidden h-44">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/20 dark:from-black/40 to-transparent" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-5">
                      {/* Trial badge */}
                      {product.trial_period_days && product.trial_period_days > 0 && (
                        <div className="inline-flex items-center gap-1.5 self-start mb-3 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                          <Star className="w-3 h-3" />
                          {product.trial_period_days} dias grátis
                        </div>
                      )}

                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5 flex-1 line-clamp-3">
                        {product.description || 'Descrição não disponível'}
                      </p>

                      {/* Price */}
                      <div className="mb-4">
                        {product.price_monthly ? (
                          <div className="flex items-baseline gap-1">
                            <span
                              className="text-2xl font-bold"
                              style={{ color: color.from }}
                            >
                              {formatPrice(product.price_monthly)}
                            </span>
                            <span className="text-xs text-gray-400">/mês</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 italic">Consulte valores</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 mt-auto">
                        {product.trial_period_days && product.trial_period_days > 0 && (
                          <Button
                            onClick={(e) => { e.stopPropagation(); handleStartTrial(product); }}
                            className="w-full h-10 rounded-xl text-sm font-semibold btn-secondary"
                            disabled={startingTrials[product.id]}
                          >
                            {startingTrials[product.id] ? (
                              <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />Iniciando...</>
                            ) : (
                              <><TestTube2 className="mr-2 h-3.5 w-3.5" />Testar Grátis</>
                            )}
                          </Button>
                        )}
                        <Button
                          onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
                          className="w-full h-10 rounded-xl text-sm font-semibold btn-primary group/btn"
                        >
                          <span>Ver Detalhes</span>
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* View all */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            asChild
            className="btn-primary h-12 px-8 rounded-2xl font-semibold text-sm pulse-glow"
          >
            <Link to="/produtos" className="flex items-center gap-2">
              Ver Todas as Soluções
              <ArrowRight size={16} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;
