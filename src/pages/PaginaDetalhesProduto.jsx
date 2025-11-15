
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { CheckCircle, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/lib/supabaseClient';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PaginaDetalhesProduto = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [licenseType, setLicenseType] = useState('lifetime');
    const [isLoadingTrial, setIsLoadingTrial] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                setError('Erro ao buscar o produto.');
                console.error(error);
            } else {
                setProduct(data);
            }
            setLoading(false);
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleAddToCart = () => {
        const price = licenseType === 'monthly' ? product.price_monthly : product.price_lifetime;
        const license = licenseType === 'monthly' ? 'Licença Mensal' : 'Licença Vitalícia';
        
        const productToAdd = {
            ...product,
            price: `R$ ${price}`,
            license,
        };
        addToCart(productToAdd);
        toast({
            title: "✅ Produto Adicionado!",
            description: `${product.name} (${license}) foi adicionado ao seu carrinho.`,
        });
    };

    const handleStartTrial = async () => {
        if (!product || !product.trial_period_days || product.trial_period_days <= 0) {
            toast({
                title: "Produto não oferece teste",
                description: "Este produto não tem um período de teste gratuito disponível.",
                variant: "destructive",
            });
            return;
        }

        setIsLoadingTrial(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            toast({
                title: "⚠️ Login Necessário",
                description: "Você precisa fazer login para iniciar um teste.",
                variant: "destructive",
            });
            navigate('/login');
            setIsLoadingTrial(false);
            return;
        }

        const user = session.user;
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + product.trial_period_days);

        const { error } = await supabase
            .from('user_product_access')
            .insert({
                user_id: user.id,
                product_id: product.id,
                product_name: product.name,
                access_level: 'trial',
                expires_at: expiresAt.toISOString(),
            });

        if (error) {
            if (error.code === '23505') { // Unique constraint violation
                toast({
                    title: "👍 Acesso Já Existente",
                    description: "Você já possui um teste ativo ou acesso a este produto.",
                });
            } else {
                toast({
                    title: "❌ Erro ao Iniciar Teste",
                    description: "Não foi possível iniciar seu teste. Tente novamente.",
                    variant: "destructive",
                });
                console.error("Erro ao inserir acesso de teste:", error);
            }
        } else {
            toast({
                title: "🚀 Teste Gratuito Iniciado!",
                description: `Você ativou ${product.trial_period_days} dias de teste para o ${product.name}. Aproveite!`,
            });
        }
        setIsLoadingTrial(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-14rem)]">
                <Loader2 className="w-12 h-12 animate-spin text-[#14B8A6]" />
            </div>
        );
    }
    
    if (error || !product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] text-center">
                <h1 className="text-4xl font-bold text-gradient mb-4">Produto não encontrado</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">{error || "O produto que você está procurando não existe."}</p>
                <Button asChild>
                    <Link to="/produtos">Voltar para Produtos</Link>
                </Button>
            </div>
        );
    }

    const canTest = product.trial_period_days && product.trial_period_days > 0;

    return (
        <>
            <Helmet>
                <title>{product.name} - LWDigitalForge</title>
                <meta name="description" content={product.short_description || product.description} />
            </Helmet>
            <div className="py-12 px-4 bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]">
                <div className="container mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="grid md:grid-cols-2 gap-12 items-center"
                    >
                        <div className="p-8 bg-white dark:bg-[#111827]/50 rounded-xl border border-gray-200 dark:border-[#14B8A6]/20 flex items-center justify-center">
                            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 120 }}>
                                <img className="w-full max-w-sm rounded-lg" alt={`Imagem do produto ${product.name}`} src={product.image_url || "https://via.placeholder.com/500x500.png?text=Imagem+Indisponível"} />
                            </motion.div>
                        </div>
                        <div>
                            <span className="inline-block px-3 py-1 bg-[#14B8A6] text-white dark:text-[#0D1117] text-xs font-bold rounded-full mb-4">{product.type}</span>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">{product.name}</h1>
                            <p className="text-lg text-gray-600 dark:text-[#F9FAFB]/80 mb-6">{product.detailed_description || product.description}</p>
                            
                            {product.features && product.features.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-2xl font-semibold mb-4">Funcionalidades:</h3>
                                    <ul className="space-y-3">
                                        {product.features.map((feature, index) => (
                                            <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                                                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="bg-gray-100 dark:bg-[#111827]/70 p-6 rounded-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <span className="text-3xl font-bold text-[#14B8A6]">
                                            {licenseType === 'monthly' ? `R$ ${product.price_monthly}` : `R$ ${product.price_lifetime}`}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400 ml-2">
                                            {licenseType === 'monthly' ? '/mês' : 'pagamento único'}
                                        </span>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="bg-transparent dark:bg-[#0D1117]">
                                                {licenseType === 'monthly' ? 'Licença Mensal' : 'Licença Vitalícia'}
                                                <ChevronDown className="w-4 h-4 ml-2" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onSelect={() => setLicenseType('lifetime')}>Licença Vitalícia</DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => setLicenseType('monthly')}>Licença Mensal</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {canTest && (
                                        <Button onClick={handleStartTrial} disabled={isLoadingTrial} className="w-full btn-primary px-8 py-4 text-lg font-semibold rounded-lg pulse-glow">
                                            {isLoadingTrial ? 'Processando...' : `Testar por ${product.trial_period_days} Dias`}
                                        </Button>
                                    )}
                                    <Button onClick={handleAddToCart} variant="secondary" className="w-full btn-secondary px-8 py-4 text-lg font-semibold rounded-lg bg-transparent">
                                        Adicionar ao Carrinho
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default PaginaDetalhesProduto;
