import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingCart, Loader2, ArrowLeft, CheckCircle, Shield, Zap, Calendar } from 'lucide-react';

const placeholderImage = "https://placehold.co/600x400/1e293b/white?text=Produto+Digital";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPrice, setSelectedPrice] = useState(null); // 'monthly', 'annual', 'lifetime'

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
      } else {
        setProduct(data);
        // Define um preço padrão inicial
        if (data.price_lifetime) setSelectedPrice('lifetime');
        else if (data.price_annual) setSelectedPrice('annual');
        else if (data.price_monthly) setSelectedPrice('monthly');
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !selectedPrice) return;

    let price = 0;
    let variantName = '';

    if (selectedPrice === 'monthly') {
        price = product.price_monthly;
        variantName = 'Plano Mensal';
    } else if (selectedPrice === 'annual') {
        price = product.price_annual;
        variantName = 'Plano Anual';
    } else {
        price = product.price_lifetime;
        variantName = 'Licença Vitalícia';
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
                                <p className="text-sm text-indigo-600/80 dark:text-indigo-400">Garantia incondicional. Se não gostar, devolvemos seu dinheiro.</p>
                            </div>
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
