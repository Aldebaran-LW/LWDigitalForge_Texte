import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { ProductHeroCarousel } from '@/components/ProductHeroCarousel';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { ShoppingCart, Loader2, ArrowLeft, CheckCircle2, Shield, Zap, Calendar, TestTube2, Star } from 'lucide-react';
import { checkUserProductAccess, startProductTrial } from '@/utils/trialHelpers';

const placeholderImage = 'https://placehold.co/800x450/1e293b/white?text=Produto+Digital';
const ENABLE_LIFETIME_PLAN = false;

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [hasActiveTrial, setHasActiveTrial] = useState(false);
  const [startingTrial, setStartingTrial] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('registered_apps').select('*').eq('id', id).single();
      if (error) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Produto não encontrado.' });
      } else {
        setProduct(data);
        if (data?.price_annual) setSelectedPrice('annual');
        else if (data?.price_monthly) setSelectedPrice('monthly');
      }
      setLoading(false);
    };

    const checkActiveTrial = async () => {
      if (!user || !id) return;
      const access = await checkUserProductAccess(user.id, id, user.email);
      if (access.hasAccess && ['trial', 'subscription', 'subscription_trial'].includes(access.accessType)) {
        setHasActiveTrial(true);
      }
    };

    if (id) { fetchProduct(); checkActiveTrial(); }
  }, [id, user]);

  const handleAddToCart = () => {
    if (!product || !selectedPrice) return;
    const priceMap = {
      monthly: { price: product.price_monthly, label: 'Plano Mensal' },
      annual: { price: product.price_annual, label: 'Plano Anual' },
    };
    const mapped = priceMap[selectedPrice];
    if (!mapped) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Plano indisponível no momento.' });
      return;
    }
    const { price, label } = mapped;
    if (!price) { toast({ variant: 'destructive', title: 'Erro', description: 'Preço não disponível.' }); return; }

    const cartItem = {
      id: product.id,
      title: product.name,
      image: product.image_url,
      variants: [{
        id: `${product.id}_${selectedPrice}`,
        title: label,
        price_in_cents: price,
        price_formatted: `R$ ${(price / 100).toFixed(2).replace('.', ',')}`,
        currency_info: { code: 'BRL', symbol: 'R$', template: '$1' },
        inventory_quantity: 999,
        manage_inventory: false,
      }],
    };

    addToCart(cartItem, cartItem.variants[0], 1, 999)
      .then(() => toast({ title: 'Adicionado ao Carrinho!', description: `${product.name} (${label}) foi adicionado.` }))
      .catch((err) => toast({ variant: 'destructive', title: 'Erro', description: err.message }));
  };

  const handleStartTrial = async () => {
    if (!user) {
      toast({ title: 'Login Necessário', description: 'Faça login ou cadastre-se para iniciar o teste grátis.' });
      navigate('/login');
      return;
    }
    setStartingTrial(true);
    try {
      const result = await startProductTrial(user.id, product.id, product.name, product.trial_period_days || 30, user.email);
      if (result.success) {
        toast({ title: 'Teste Iniciado!', description: `Você tem ${product.trial_period_days} dias para testar. Redirecionando...` });
        setHasActiveTrial(true);
        setTimeout(() => { result.redirectUrl ? window.open(result.redirectUrl, '_blank') : navigate('/portal/testes'); }, 2000);
      } else {
        if (result.redirectUrl) {
          toast({ title: 'Você já tem acesso!', description: 'Redirecionando para o aplicativo...' });
          setTimeout(() => window.open(result.redirectUrl, '_blank'), 1000);
        } else {
          toast({ variant: 'destructive', title: 'Erro', description: result.message || 'Não foi possível iniciar o teste.' });
        }
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível iniciar o teste.' });
    } finally {
      setStartingTrial(false);
    }
  };

  const formatPrice = (cents) => `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
    </div>
  );
  if (!product) return (
    <div className="text-center p-20 text-gray-500 dark:text-gray-400">Produto não encontrado.</div>
  );

  const plans = [
    product.price_monthly && { key: 'monthly', label: 'Mensal', sublabel: 'Cancele quando quiser', price: product.price_monthly, accent: '#3B82F6', badge: null },
    product.price_annual && { key: 'annual', label: 'Anual', sublabel: `${formatPrice(Math.round(product.price_annual / 12))}/mês em 12x`, price: product.price_annual, accent: '#06B6D4', badge: 'Economize' },
    ENABLE_LIFETIME_PLAN && product.price_lifetime && { key: 'lifetime', label: 'Vitalício', sublabel: 'Pagamento único', price: product.price_lifetime, accent: '#8B5CF6', badge: 'Melhor Opção' },
  ].filter(Boolean);

  const extraGallery = Array.isArray(product.hero_gallery_urls)
    ? product.hero_gallery_urls
    : [];
  const heroImages = [product.image_url || placeholderImage, ...extraGallery].filter(Boolean);

  return (
    <>
      <Helmet>
        <title>{product.name} - LWDigitalForge</title>
      </Helmet>

      <div className="min-h-screen overflow-x-clip bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]">
        {/* Breadcrumb — mesma largura do conteúdo principal */}
        <div className="sticky top-16 z-20 border-b border-gray-200/80 bg-white/80 backdrop-blur-md dark:border-white/6 dark:bg-[#080C14]/80">
          <div className="mx-auto max-w-[1600px] px-4 py-3 md:px-8">
            <Link
              to="/produtos"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar aos Produtos
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-[1600px] px-4 py-8 md:px-8 md:py-12">
          <div className="mb-12 grid min-w-0 items-start gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            {/* Coluna imagem (à direita no desktop; “vaza” levemente pra borda como referência Macofel) */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="min-w-0 lg:order-2"
            >
              <div className="space-y-4">
                <div className="mx-auto w-full max-w-lg sm:max-w-xl lg:mx-0 lg:ml-auto lg:max-w-none lg:-mr-4 xl:-mr-8 2xl:-mr-12">
                  <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 shadow-[0_35px_90px_-45px_rgba(15,23,42,0.22)] dark:border-white/10 dark:bg-slate-900/40 dark:shadow-[0_35px_90px_-45px_rgba(0,0,0,0.55)]">
                    <ProductHeroCarousel
                      images={heroImages}
                      alt={product.name}
                      autoPlayInterval={5000}
                      variant="macofel"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Coluna texto + planos (à esquerda no desktop) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="flex min-w-0 flex-col lg:order-1"
            >
              <div className="sticky top-28 space-y-6">
                <div className="mb-2">
                  <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white md:text-4xl">
                    {product.name}
                  </h1>
                  {product.description && (
                    <p className="max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
                      {product.description}
                    </p>
                  )}
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1526] border border-slate-100 dark:border-white/10 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">
                    Escolha seu plano
                  </h2>

                  {/* Plans */}
                  <div className="space-y-3 mb-5">
                    {plans.map((plan) => (
                      <button
                        key={plan.key}
                        type="button"
                        onClick={() => setSelectedPrice(plan.key)}
                        className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left group ${
                          selectedPrice === plan.key
                            ? 'border-opacity-100 shadow-sm'
                            : 'border-gray-200 dark:border-white/8 hover:border-opacity-60'
                        }`}
                        style={selectedPrice === plan.key ? {
                          borderColor: plan.accent,
                          background: `${plan.accent}06`,
                        } : {}}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            {/* Radio */}
                            <div
                              className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
                              style={{
                                borderColor: selectedPrice === plan.key ? plan.accent : '#9CA3AF',
                              }}
                            >
                              {selectedPrice === plan.key && (
                                <div className="w-2 h-2 rounded-full" style={{ background: plan.accent }} />
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                  {plan.label}
                                </span>
                                {plan.badge && (
                                  <span
                                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                                    style={{ background: `${plan.accent}15`, color: plan.accent }}
                                  >
                                    {plan.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400">{plan.sublabel}</p>
                            </div>
                          </div>

                          <div className="text-right ml-3 flex-shrink-0">
                            <div className="text-lg font-bold" style={{ color: plan.accent }}>
                              {formatPrice(plan.price)}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Trial banner */}
                  {product.trial_period_days && product.trial_period_days > 0 && (
                    <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center gap-3 mb-4">
                      <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                          Teste Grátis por {product.trial_period_days} dias
                        </p>
                        <p className="text-xs text-indigo-500 dark:text-indigo-400">
                          Experimente sem compromisso
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Trial active */}
                  {hasActiveTrial && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-3 mb-4">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                          Teste ativo
                        </p>
                        <Link to="/portal/testes" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                          Ver meus testes →
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* CTA buttons */}
                  <div className="space-y-2.5">
                    {product.trial_period_days && product.trial_period_days > 0 && !hasActiveTrial && (
                      <Button
                        onClick={handleStartTrial}
                        disabled={startingTrial}
                        className="w-full h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 transition-all"
                      >
                        {startingTrial ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <TestTube2 className="mr-2 h-4 w-4" />
                            Iniciar Teste Grátis ({product.trial_period_days} dias)
                          </>
                        )}
                      </Button>
                    )}

                    <Button
                      onClick={handleAddToCart}
                      disabled={!selectedPrice}
                      className="w-full h-11 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 transition-all group"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {selectedPrice ? 'Adicionar ao Carrinho' : 'Selecione um Plano'}
                    </Button>
                  </div>

                  {/* Trust line */}
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/6 flex flex-wrap justify-center gap-4">
                    {[
                      { icon: Shield, label: 'Seguro' },
                      { icon: Zap, label: 'Imediato' },
                    ].map((b, i) => (
                      <span key={i} className="flex items-center gap-1.5 text-xs text-gray-400">
                        <b.icon size={13} className="text-gray-400" />
                        {b.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Texto longo e extras (abaixo do grid, largura total — evita competir com a galeria) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="space-y-8 border-t border-slate-200/80 pt-10 dark:border-white/10"
          >
            {product.detailed_description && (
              <div>
                <h3 className="mb-3 text-base font-bold text-gray-900 dark:text-white">
                  Sobre este produto
                </h3>
                <p className="max-w-3xl text-sm leading-relaxed text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {product.detailed_description}
                </p>
              </div>
            )}

            {product.features && product.features.length > 0 && (
              <div className="rounded-2xl border border-gray-200/80 bg-white p-6 dark:border-white/6 dark:bg-[#0D1526]">
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white">
                  <Star size={16} className="text-amber-400" />
                  O que está incluído
                </h3>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0 text-emerald-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {[
                { icon: Shield, label: 'Pagamento Seguro', color: '#10B981' },
                { icon: Zap, label: 'Acesso Imediato', color: '#3B82F6' },
                { icon: Star, label: 'Suporte Dedicado', color: '#F59E0B' },
              ].map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-1.5 text-xs text-gray-600 dark:bg-white/5 dark:text-gray-400"
                >
                  <badge.icon size={13} style={{ color: badge.color }} />
                  {badge.label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
