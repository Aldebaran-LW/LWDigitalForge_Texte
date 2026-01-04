import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { ShoppingCart, Loader2, ArrowLeft, CheckCircle, Shield, Zap, Calendar, TestTube2 } from 'lucide-react';
import { checkUserProductAccess, startProductTrial } from '@/utils/trialHelpers';

const placeholderImage = "https://placehold.co/600x400/1e293b/white?text=Produto+Digital";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPrice, setSelectedPrice] = useState(null); // 'monthly', 'annual', 'lifetime'
  const [hasActiveTrial, setHasActiveTrial] = useState(false);
  const [startingTrial, setStartingTrial] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('registered_apps')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar produto:', error);
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Produto não encontrado.',
        });
      } else {
        setProduct(data);
        // Define um preço padrão inicial baseado nos preços disponíveis
        if (data && data.price_lifetime) {
          setSelectedPrice('lifetime');
        } else if (data && data.price_annual) {
          setSelectedPrice('annual');
        } else if (data && data.price_monthly) {
          setSelectedPrice('monthly');
        }
      }
      setLoading(false);
    };

    const checkActiveTrial = async () => {
      if (!user || !id) return;
      
      const access = await checkUserProductAccess(user.id, id, user.email);
      if (access.hasAccess) {
        // Se tem acesso via assinatura, também considerar como acesso válido
        if (access.accessType === 'trial' || access.accessType === 'subscription' || access.accessType === 'subscription_trial') {
          setHasActiveTrial(true);
        }
      }
    };

    if (id) {
      fetchProduct();
      checkActiveTrial();
    }
  }, [id, user]);

  const handleAddToCart = () => {
    if (!product || !selectedPrice) return;

    let price = 0;
    let variantName = '';

    if (selectedPrice === 'monthly') {
        if (!product.price_monthly) {
            toast({ variant: "destructive", title: "Erro", description: "Preço mensal não disponível." });
            return;
        }
        price = product.price_monthly;
        variantName = 'Plano Mensal';
    } else if (selectedPrice === 'annual') {
        if (!product.price_annual) {
            toast({ variant: "destructive", title: "Erro", description: "Preço anual não disponível." });
            return;
        }
        price = product.price_annual;
        variantName = 'Plano Anual';
    } else if (selectedPrice === 'lifetime') {
        if (!product.price_lifetime) {
            toast({ variant: "destructive", title: "Erro", description: "Preço vitalício não disponível." });
            return;
        }
        price = product.price_lifetime;
        variantName = 'Licença Vitalícia';
    } else {
        toast({ variant: "destructive", title: "Erro", description: "Plano selecionado inválido." });
        return;
    }

    const cartItem = {
        id: product.id,
        title: product.name,
        image: product.image_url,
        variants: [{
            id: `${product.id}_${selectedPrice}`,
            title: variantName,
            price_in_cents: price,
            price_formatted: `R$ ${(price / 100).toFixed(2).replace('.', ',')}`,
            currency_info: { code: 'BRL', symbol: 'R$', template: '$1' },
            inventory_quantity: 999,
            manage_inventory: false
        }]
    };

    addToCart(cartItem, cartItem.variants[0], 1, 999)
      .then(() => {
        toast({
          title: "Adicionado ao Carrinho!",
          description: `${product.name} (${variantName}) foi adicionado.`,
        });
      })
      .catch(err => {
         toast({ variant: "destructive", title: "Erro", description: err.message });
      });
  };

  const handleStartTrial = async () => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login ou cadastre-se para iniciar o teste grátis.",
      });
      navigate('/login');
      return;
    }

    setStartingTrial(true);

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
          description: `Você tem ${product.trial_period_days} dias para testar ${product.name}. Redirecionando...`,
        });
        setHasActiveTrial(true);
        
        // Redirecionar para o app após 2 segundos
        setTimeout(() => {
          if (result.redirectUrl) {
            window.open(result.redirectUrl, '_blank');
          } else {
            navigate('/portal/testes');
          }
        }, 2000);
      } else {
        // Se já tem acesso, redirecionar direto para o app
        if (result.redirectUrl) {
          toast({
            title: "Você já tem acesso!",
            description: "Redirecionando para o aplicativo...",
          });
          setTimeout(() => {
            window.open(result.redirectUrl, '_blank');
          }, 1000);
        } else {
          toast({
            variant: "destructive",
            title: "Erro",
            description: result.message || "Não foi possível iniciar o teste.",
          });
        }
      }
    } catch (error) {
      console.error('Erro ao iniciar teste:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível iniciar o teste.",
      });
    } finally {
      setStartingTrial(false);
    }
  };

  const formatPrice = (cents) => `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="h-16 w-16 animate-spin text-blue-500" /></div>;
  if (!product) return <div className="text-center p-10">Produto não encontrado.</div>;

  return (
    <>
      <Helmet>
        <title>{product.name} - LWDigitalForge</title>
      </Helmet>
      
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        <Link to="/produtos" className="inline-flex items-center mb-4 sm:mb-6 text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors min-h-[44px]">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar aos Produtos
        </Link>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            {/* Coluna da Esquerda: Imagem e Descrição */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl border border-gray-200 dark:border-gray-700 mb-6 sm:mb-8">
                    <img src={product.image_url || placeholderImage} alt={product.name} className="w-full h-auto max-h-[300px] sm:max-h-[400px] md:max-h-none object-cover" />
                </div>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white">{product.name}</h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">{product.description}</p>

                {product.detailed_description && (
                    <div className="prose dark:prose-invert max-w-none mb-6 sm:mb-8 text-sm sm:text-base">
                        <h3 className="text-base sm:text-lg font-semibold mb-2">Sobre este produto</h3>
                        <p className="whitespace-pre-line">{product.detailed_description}</p>
                    </div>
                )}

                {product.features && product.features.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-5 md:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">O que está incluído:</h3>
                        <ul className="space-y-2 sm:space-y-3">
                            {product.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </motion.div>

            {/* Coluna da Direita: Preços e Checkout */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="sticky top-20 md:top-24 bg-white dark:bg-[#111827] p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Escolha seu plano</h2>

                    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                        {product.price_monthly && (
                            <div 
                                onClick={() => setSelectedPrice('monthly')}
                                className={`cursor-pointer p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all flex justify-between items-center min-h-[60px] sm:min-h-[70px] ${selectedPrice === 'monthly' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'}`}
                            >
                                <div className="flex items-center gap-2 sm:gap-3 flex-1">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedPrice === 'monthly' ? 'border-blue-500' : 'border-gray-400'}`}>
                                        {selectedPrice === 'monthly' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm sm:text-base">Assinatura Mensal</p>
                                        <p className="text-xs sm:text-sm text-gray-500">Cancele quando quiser</p>
                                    </div>
                                </div>
                                <span className="text-lg sm:text-xl font-bold text-blue-600 ml-2 flex-shrink-0">{formatPrice(product.price_monthly)}</span>
                            </div>
                        )}

                        {product.price_annual && (
                            <div 
                                onClick={() => setSelectedPrice('annual')}
                                className={`cursor-pointer p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all flex justify-between items-center min-h-[60px] sm:min-h-[70px] ${selectedPrice === 'annual' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'}`}
                            >
                                <div className="flex items-center gap-2 sm:gap-3 flex-1">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedPrice === 'annual' ? 'border-blue-500' : 'border-gray-400'}`}>
                                        {selectedPrice === 'annual' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm sm:text-base flex items-center flex-wrap gap-1">
                                            Anual 
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Economize</span>
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-500">Faturamento único anual</p>
                                    </div>
                                </div>
                                <span className="text-lg sm:text-xl font-bold text-blue-600 ml-2 flex-shrink-0">{formatPrice(product.price_annual)}</span>
                            </div>
                        )}

                        {product.price_lifetime && (
                            <div 
                                onClick={() => setSelectedPrice('lifetime')}
                                className={`cursor-pointer p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all flex justify-between items-center min-h-[60px] sm:min-h-[70px] ${selectedPrice === 'lifetime' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'}`}
                            >
                                <div className="flex items-center gap-2 sm:gap-3 flex-1">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedPrice === 'lifetime' ? 'border-purple-500' : 'border-gray-400'}`}>
                                        {selectedPrice === 'lifetime' && <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm sm:text-base flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-purple-500 flex-shrink-0" /> 
                                            <span>Vitalício</span>
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-500">Pague uma única vez</p>
                                    </div>
                                </div>
                                <span className="text-lg sm:text-xl font-bold text-purple-600 ml-2 flex-shrink-0">{formatPrice(product.price_lifetime)}</span>
                            </div>
                        )}
                    </div>

                    {product.trial_period_days && product.trial_period_days > 0 && (
                        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 flex items-start gap-2 sm:gap-3">
                            <Calendar className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-sm sm:text-base text-indigo-700 dark:text-indigo-300">Teste Grátis de {product.trial_period_days} Dias</p>
                                <p className="text-xs sm:text-sm text-indigo-600/80 dark:text-indigo-400">Experimente antes de comprar. Sem compromisso!</p>
                            </div>
                        </div>
                    )}

                    {product.trial_period_days && product.trial_period_days > 0 && !hasActiveTrial && (
                        <Button 
                            onClick={handleStartTrial} 
                            size="lg" 
                            className="w-full py-4 sm:py-5 md:py-6 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all mb-3 sm:mb-4 bg-green-600 hover:bg-green-700 min-h-[48px] sm:min-h-[56px]"
                            disabled={startingTrial}
                        >
                            {startingTrial ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Iniciando Teste...
                                </>
                            ) : (
                                <>
                                    <TestTube2 className="mr-2 h-5 w-5" />
                                    <span className="hidden sm:inline">Iniciar Teste Grátis ({product.trial_period_days} dias)</span>
                                    <span className="sm:hidden">Teste Grátis ({product.trial_period_days}d)</span>
                                </>
                            )}
                        </Button>
                    )}

                    {hasActiveTrial && (
                        <div className="bg-green-50 dark:bg-green-900/30 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4 text-center">
                            <p className="font-semibold text-sm sm:text-base text-green-700 dark:text-green-300">✓ Você já tem um teste ativo deste produto</p>
                            <Link to="/portal/testes" className="text-xs sm:text-sm text-green-600 dark:text-green-400 hover:underline">
                                Ver meus testes
                            </Link>
                        </div>
                    )}

                    <Button 
                        onClick={handleAddToCart} 
                        size="lg" 
                        className="w-full py-4 sm:py-5 md:py-6 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all min-h-[48px] sm:min-h-[56px]"
                        disabled={!selectedPrice}
                    >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        {selectedPrice ? (
                            <>
                                <span className="hidden sm:inline">Adicionar ao Carrinho</span>
                                <span className="sm:hidden">Adicionar</span>
                            </>
                        ) : (
                            'Selecione uma Opção'
                        )}
                    </Button>
                    
                    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Pagamento Seguro</span>
                        <span className="flex items-center gap-1"><Zap className="w-4 h-4" /> Acesso Imediato</span>
                    </div>
                </div>
            </motion.div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
