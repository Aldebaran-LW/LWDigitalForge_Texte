import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import ProductCard from './ProductCard';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('registered_apps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar produtos:', error);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-48 sm:h-64"><Loader2 className="h-12 w-12 sm:h-16 sm:w-16 text-blue-500 animate-spin" /></div>;

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 p-6 sm:p-8">
        <p className="text-sm sm:text-base">Nenhum produto disponível no momento.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductsList;
