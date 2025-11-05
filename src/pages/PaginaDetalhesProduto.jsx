import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Bot, FileSpreadsheet, Zap, Shield, CheckCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useCart } from '@/contexts/CartContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const productsData = [
    { id: 1, type: 'BOT TELEGRAM', name: 'AutoBot Pro', description: 'Bot inteligente para automação de atendimento e vendas no Telegram. Uma solução completa para escalar seu negócio digital.', price: { monthly: 'R$ 97/mês', lifetime: 'R$ 297' }, icon: Bot, features: ['Respostas automáticas 24/7', 'Integração com CRM e Planilhas', 'Analytics de conversas', 'Gatilhos personalizáveis'], tag: 'NOVO!' },
    { id: 2, type: 'PLANILHA EXCEL', name: 'DataMaster', description: 'Planilha inteligente para análise de dados e relatórios automatizados. Transforme números em decisões estratégicas.', price: { monthly: 'R$ 47/mês', lifetime: 'R$ 197' }, icon: FileSpreadsheet, features: ['Dashboards dinâmicos e interativos', 'Fórmulas avançadas pré-configuradas', 'Gráficos personalizáveis', 'Importação de dados simplificada'] },
    { id: 3, type: 'BOT TELEGRAM', name: 'SalesBot Elite', description: 'Automatize todo seu funil de vendas com inteligência artificial. Qualifique leads e feche vendas no piloto automático.', price: { monthly: 'R$ 147/mês', lifetime: 'R$ 497' }, icon: Zap, features: ['IA conversacional avançada', 'Integração com gateways de pagamento', 'Funil de follow-up automático', 'Testes A/B de mensagens'] },
    { id: 4, type: 'PLANILHA EXCEL', name: 'FinanceTracker', description: 'Controle financeiro completo com previsões e alertas inteligentes. Tenha clareza total sobre a saúde financeira do seu negócio.', price: { monthly: 'R$ 37/mês', lifetime: 'R$ 147' }, icon: Shield, features: ['Controle de fluxo de caixa', 'Previsões de faturamento automáticas', 'Relatórios mensais com um clique', 'Alertas de contas a pagar/receber'] }
];

const PaginaDetalhesProduto = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const product = productsData.find(p => p.id === parseInt(id));
    const [licenseType, setLicenseType] = useState('lifetime');

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
            price: licenseType === 'monthly' ? product.price.monthly : product.price.lifetime,
            license: licenseType === 'monthly' ? 'Licença Mensal' : 'Licença Vitalícia',
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
                                <img class="w-full max-w-sm rounded-lg" alt={`Imagem do produto ${product.name}`} src="https://images.unsplash.com/photo-1660300661271-b2d08ac4c9af" />
                            </motion.div>
                        </div>
                        <div>
                            <span className="inline-block px-3 py-1 bg-[#14B8A6] text-white dark:text-[#0D1117] text-xs font-bold rounded-full mb-4">{product.type}</span>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">{product.name}</h1>
                            <p className="text-lg text-gray-600 dark:text-[#F9FAFB]/80 mb-6">{product.description}</p>

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

                            <div className="bg-gray-100 dark:bg-[#111827]/70 p-6 rounded-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <span className="text-3xl font-bold text-[#14B8A6]">{licenseType === 'monthly' ? product.price.monthly : product.price.lifetime}</span>
                                        <span className="text-gray-500 dark:text-gray-400 ml-2">{licenseType === 'monthly' ? 'por mês' : 'pagamento único'}</span>
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
                                    <Button onClick={handleTestClick} className="w-full btn-primary px-8 py-4 text-lg font-semibold rounded-lg pulse-glow">
                                        Testar por 7 Dias
                                    </Button>
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