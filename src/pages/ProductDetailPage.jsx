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
      
      const access = await checkUserProductAccess(user.id, id);
      if (access.hasAccess && access.accessType === 'trial') {
        setHasActiveTrial(true);
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
      const result = await startProductTrial(user.id, product);
      
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
            description: result.error,
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
      
      <div className="container mx-auto px-4 py-12">
        <Link to="/produtos" className="inline-flex items-center mb-6 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar aos Produtos
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
            {/* Coluna da Esquerda: Imagem e Descrição */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 mb-8">
                    <img src={product.image_url || placeholderImage} alt={product.name} className="w-full h-auto object-cover" />
                </div>
                
                <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{product.name}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">{product.description}</p>

                {product.detailed_description && (
                    <div className="prose dark:prose-invert max-w-none mb-8">
                        <h3 className="text-lg font-semibold mb-2">Sobre este produto</h3>
                        <p className="whitespace-pre-line">{product.detailed_description}</p>
                    </div>
                )}

                {product.features && product.features.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-4">O que está incluído:</h3>
                        <ul className="space-y-3">
                            {product.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center text-gray-700 dark:text-gray-300">
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </motion.div>

            {/* Coluna da Direita: Preços e Checkout */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="sticky top-24 bg-white dark:bg-[#111827] p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold mb-6">Escolha seu plano</h2>

                    <div className="space-y-4 mb-8">
                        {product.price_monthly && (
                            <div 
                                onClick={() => setSelectedPrice('monthly')}
                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex justify-between items-center ${selectedPrice === 'monthly' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPrice === 'monthly' ? 'border-blue-500' : 'border-gray-400'}`}>
                                        {selectedPrice === 'monthly' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                                    </div>
                                    <div>
                                        <p className="font-bold">Assinatura Mensal</p>
                                        <p className="text-sm text-gray-500">Cancele quando quiser</p>
                                    </div>
                                </div>
                                <span className="text-xl font-bold text-blue-600">{formatPrice(product.price_monthly)}</span>
                            </div>
                        )}

                        {product.price_annual && (
                            <div 
                                onClick={() => setSelectedPrice('annual')}
                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex justify-between items-center ${selectedPrice === 'annual' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPrice === 'annual' ? 'border-blue-500' : 'border-gray-400'}`}>
                                        {selectedPrice === 'annual' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                                    </div>
                                    <div>
                                        <p className="font-bold">Anual <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full ml-2">Economize</span></p>
                                        <p className="text-sm text-gray-500">Faturamento único anual</p>
                                    </div>
                                </div>
                                <span className="text-xl font-bold text-blue-600">{formatPrice(product.price_annual)}</span>
                            </div>
                        )}

                        {product.price_lifetime && (
                            <div 
                                onClick={() => setSelectedPrice('lifetime')}
                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex justify-between items-center ${selectedPrice === 'lifetime' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPrice === 'lifetime' ? 'border-purple-500' : 'border-gray-400'}`}>
                                        {selectedPrice === 'lifetime' && <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />}
                                    </div>
                                    <div>
                                        <p className="font-bold flex items-center gap-2"><Zap className="w-4 h-4 text-purple-500" /> Vitalício</p>
                                        <p className="text-sm text-gray-500">Pague uma única vez</p>
                                    </div>
                                </div>
                                <span className="text-xl font-bold text-purple-600">{formatPrice(product.price_lifetime)}</span>
                            </div>
                        )}
                    </div>

                    {product.trial_period_days && product.trial_period_days > 0 && (
                        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg mb-6 flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-indigo-600 mt-1" />
                            <div>
                                <p className="font-semibold text-indigo-700 dark:text-indigo-300">Teste Grátis de {product.trial_period_days} Dias</p>
                                <p className="text-sm text-indigo-600/80 dark:text-indigo-400">Experimente antes de comprar. Sem compromisso!</p>
                            </div>
                        </div>
                    )}

                    {product.trial_period_days && product.trial_period_days > 0 && !hasActiveTrial && (
                        <Button 
                            onClick={handleStartTrial} 
                            size="lg" 
                            className="w-full py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all mb-4 bg-green-600 hover:bg-green-700"
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
                                    Iniciar Teste Grátis ({product.trial_period_days} dias)
                                </>
                            )}
                        </Button>
                    )}

                    {hasActiveTrial && (
                        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg mb-4 text-center">
                            <p className="font-semibold text-green-700 dark:text-green-300">✓ Você já tem um teste ativo deste produto</p>
                            <Link to="/portal/testes" className="text-sm text-green-600 dark:text-green-400 hover:underline">
                                Ver meus testes
                            </Link>
                        </div>
                    )}

                    <Button 
                        onClick={handleAddToCart} 
                        size="lg" 
                        className="w-full py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                        disabled={!selectedPrice}
                    >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        {selectedPrice ? 'Adicionar ao Carrinho' : 'Selecione uma Opção'}
                    </Button>
                    
                    <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500">
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
