
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bot, FileSpreadsheet, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProductsSection = () => {
  const products = [
    {
      id: 1,
      type: 'BOT TELEGRAM',
      name: 'AutoBot Pro',
      description: 'Bot inteligente para automação de atendimento e vendas no Telegram',
      price: 'R$ 297',
      icon: Bot,
      features: ['Respostas automáticas', 'Integração com CRM', 'Analytics avançado'],
      tag: 'NOVO!',
    },
    {
      id: 2,
      type: 'PLANILHA EXCEL',
      name: 'DataMaster',
      description: 'Planilha inteligente para análise de dados e relatórios automatizados',
      price: 'R$ 197',
      icon: FileSpreadsheet,
      features: ['Dashboards dinâmicos', 'Fórmulas avançadas', 'Gráficos interativos']
    },
    {
      id: 3,
      type: 'BOT TELEGRAM',
      name: 'SalesBot Elite',
      description: 'Automatize todo seu funil de vendas com inteligência artificial',
      price: 'R$ 497',
      icon: Zap,
      features: ['IA conversacional', 'Pagamentos integrados', 'Follow-up automático']
    },
    {
      id: 4,
      type: 'PLANILHA EXCEL',
      name: 'FinanceTracker',
      description: 'Controle financeiro completo com previsões e alertas inteligentes',
      price: 'R$ 147',
      icon: Shield,
      features: ['Controle de gastos', 'Previsões automáticas', 'Relatórios mensais']
    }
  ];

  return (
    <section className="py-20 px-4 bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Soluções Criadas para a Sua Produtividade
          </h2>
          <p className="text-xl text-gray-600 dark:text-[#F9FAFB]/80 max-w-3xl mx-auto">
            Descubra ferramentas poderosas que transformam a maneira como você trabalha
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white dark:bg-[#111827]/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-blue-500/20 hover:border-blue-400 dark:hover:border-blue-500/60 transition-all duration-300 relative flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="inline-block px-3 py-1 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 text-xs font-bold rounded-full">
                  {product.type}
                </div>
                {product.tag && (
                  <div className="inline-block px-3 py-1 bg-pink-500/10 dark:bg-pink-500/20 text-pink-600 dark:text-pink-300 text-xs font-bold rounded-full">
                    {product.tag}
                  </div>
                )}
              </div>

              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-full flex items-center justify-center">
                  <product.icon size={32} className="text-teal-500 dark:text-teal-400" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 text-center">
                {product.name}
              </h3>

              <p className="text-gray-600 dark:text-gray-300/80 text-sm mb-4 text-center leading-relaxed flex-grow">
                {product.description}
              </p>

              <ul className="space-y-2 mb-6">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <div className="w-1.5 h-1.5 bg-teal-500 dark:bg-teal-400 rounded-full mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="text-center mb-6">
                <span className="text-2xl font-bold text-teal-500 dark:text-teal-400">
                  {product.price}
                </span>
              </div>

              <Button asChild className="btn-secondary w-full py-3 font-semibold rounded-lg bg-transparent btn-pulse mt-auto">
                <Link to={`/produtos/${product.id}`}>Saiba Mais</Link>
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button asChild className="btn-primary px-8 py-4 text-lg font-semibold rounded-lg pulse-glow">
            <Link to="/produtos">Ver Todos os Produtos</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;
