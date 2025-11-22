import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { CheckCircle, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/lib/customSupabaseClient';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PaginaDetalhesProduto = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [licenseType, setLicenseType] = useState('lifetime');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
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
                }
            } catch (error) {
                console.error('Erro ao buscar produto:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id, toast]);

    const formatPrice = (priceInCents) => {
        if (!priceInCents) return 'Consulte valores';
        return `R$ ${(priceInCents / 100).toFixed(2).replace('.', ',')}`;
    };

    const getCurrentPrice = () => {
        if (!product) return 'Consulte valores';
        if (licenseType === 'monthly' && product.price_monthly) {
            return formatPrice(product.price_monthly);
        }
        if (licenseType === 'annual' && product.price_annual) {
            return formatPrice(product.price_annual);
        }
        if (licenseType === 'lifetime' && product.price_lifetime) {
            return formatPrice(product.price_lifetime);
        }
        return 'Consulte valores';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-14rem)]">
                <Loader2 className="h-16 w-16 text-blue-500 dark:text-white animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] text-center">
                <h1 className="text-4xl font-bold text-gradient mb-4">Produto não encontrado</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">O produto que você está procurando não existe.</p>
                <Button asChild>
                    <Link to="/produtos">Voltar para Produtos</Link>
                </Button>
            </div>
        );
    }

    const handleAddToCart = () => {
        const productToAdd = {
            ...product,
            price: getCurrentPrice(),
            license: licenseType === 'monthly' ? 'Licença Mensal' : 
                     licenseType === 'annual' ? 'Licença Anual' : 'Licença Vitalícia',
        };
        addToCart(productToAdd);
        toast({
            title: "✅ Produto Adicionado!",
            description: `${product.name} (${productToAdd.license}) foi adicionado ao seu carrinho.`,
        });
    };

    const handleTestClick = () => {
        toast({
            title: "🚀 Teste Iniciado!",
            description: "Esta funcionalidade será implementada em breve. Você precisará criar uma conta para salvar seu progresso.",
        });
    };

    return (
        <>
            <Helmet>
                <title>{product.name} - LWDigitalForge</title>
                <meta name="description" content={product.description} />
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
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 120 }}
                            >
                                {product.image_url ? (
                                    <img className="w-full max-w-sm rounded-lg" alt={`Imagem do produto ${product.name}`} src={product.image_url} />
                                ) : (
                                    <div className="w-full max-w-sm h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-400">Sem imagem</span>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">{product.name}</h1>
                            <p className="text-lg text-gray-600 dark:text-[#F9FAFB]/80 mb-6 whitespace-pre-line">{product.description || 'Sem descrição disponível'}</p>
                            
                            {(product.github_repo_url || product.vercel_deployment_url) && (
                                <div className="mb-8">
                                    <h3 className="text-2xl font-semibold mb-4">Links:</h3>
                                    <div className="space-y-2">
                                        {product.vercel_deployment_url && (
                                            <a 
                                                href={product.vercel_deployment_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center text-blue-500 hover:text-blue-600 dark:text-blue-400"
                                            >
                                                <CheckCircle className="w-5 h-5 mr-3" />
                                                <span>Acessar Aplicação</span>
                                            </a>
                                        )}
                                        {product.github_repo_url && (
                                            <a 
                                                href={product.github_repo_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center text-blue-500 hover:text-blue-600 dark:text-blue-400"
                                            >
                                                <CheckCircle className="w-5 h-5 mr-3" />
                                                <span>Ver Repositório GitHub</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="bg-gray-100 dark:bg-[#111827]/70 p-6 rounded-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <span className="text-3xl font-bold text-[#14B8A6]">{getCurrentPrice()}</span>
                                        <span className="text-gray-500 dark:text-gray-400 ml-2">
                                            {licenseType === 'monthly' ? 'por mês' : 
                                             licenseType === 'annual' ? 'por ano' : 'pagamento único'}
                                        </span>
                                    </div>
                                    {(product.price_monthly || product.price_annual || product.price_lifetime) && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="bg-transparent dark:bg-[#0D1117]">
                                                    {licenseType === 'monthly' ? 'Licença Mensal' : 
                                                     licenseType === 'annual' ? 'Licença Anual' : 'Licença Vitalícia'}
                                                    <ChevronDown className="w-4 h-4 ml-2" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                {product.price_lifetime && (
                                                    <DropdownMenuItem onSelect={() => setLicenseType('lifetime')}>Licença Vitalícia</DropdownMenuItem>
                                                )}
                                                {product.price_annual && (
                                                    <DropdownMenuItem onSelect={() => setLicenseType('annual')}>Licença Anual</DropdownMenuItem>
                                                )}
                                                {product.price_monthly && (
                                                    <DropdownMenuItem onSelect={() => setLicenseType('monthly')}>Licença Mensal</DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {product.trial_period_days && product.trial_period_days > 0 && (
                                        <Button onClick={handleTestClick} className="w-full btn-primary px-8 py-4 text-lg font-semibold rounded-lg pulse-glow">
                                            Testar por {product.trial_period_days} Dias
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