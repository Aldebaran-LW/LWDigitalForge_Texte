
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2, Info } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
import { getProducts, getProductQuantities } from '@/api/EcommerceApi';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWEyMDNkIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY0NzRjYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxXPC90ZXh0Pgo8L3N2Zz4K";

const ProductCard = ({ product, index }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const displayVariant = useMemo(() => product.variants[0], [product]);
  const hasSale = useMemo(() => displayVariant && displayVariant.sale_price_in_cents !== null, [displayVariant]);
  const displayPrice = useMemo(() => hasSale ? displayVariant.sale_price_formatted : displayVariant.price_formatted, [displayVariant, hasSale]);
  const originalPrice = useMemo(() => hasSale ? displayVariant.price_formatted : null, [displayVariant, hasSale]);

  const handleActionClick = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.variants.length > 1) {
      navigate(`/product/${product.id}`);
      return;
    }

    const defaultVariant = product.variants[0];
    const availableQuantity = defaultVariant.inventory_quantity;

    try {
      await addToCart(product, defaultVariant, 1, availableQuantity);
      toast({
        title: "Adicionado ao Carrinho! 🛒",
        description: `${product.title} foi adicionado ao seu carrinho.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar",
        description: error.message,
      });
    }
  }, [product, addToCart, toast, navigate]);
  
  const actionText = product.variants.length > 1 ? "Ver Opções" : "Adicionar ao Carrinho";
  const ActionIcon = product.variants.length > 1 ? Info : ShoppingCart;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="bg-white dark:bg-[#111827]/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-blue-500/20 hover:border-blue-400 dark:hover:border-blue-500/60 transition-all duration-300 flex flex-col"
    >
      <Link to={`/product/${product.id}`} className="flex flex-col h-full">
        <div className="relative mb-4">
          <img
            src={product.image || placeholderImage}
            alt={product.title}
            className="w-full h-56 object-cover rounded-lg"
          />
          {product.ribbon_text && (
            <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              {product.ribbon_text}
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-800 dark:text-[#F9FAFB] mb-2 truncate">
          {product.title}
        </h3>
        
        <p className="text-gray-600 dark:text-[#F9FAFB]/70 text-sm mb-4 leading-relaxed flex-grow">
          {product.subtitle || 'Explore os detalhes deste produto incrível.'}
        </p>

        <div className="text-left mb-4">
          <span className="text-2xl font-bold text-blue-500 dark:text-blue-400">
            {displayPrice}
          </span>
          {hasSale && (
            <span className="ml-2 text-lg text-gray-400 line-through">{originalPrice}</span>
          )}
        </div>
        
        <div className="mt-auto">
          <Button onClick={handleActionClick} className="w-full btn-secondary py-3 font-semibold rounded-lg bg-transparent btn-pulse">
            <ActionIcon className="mr-2 h-4 w-4" /> {actionText}
          </Button>
        </div>
      </Link>
    </motion.div>
  );
};

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductsWithQuantities = async () => {
      try {
        setLoading(true);
        setError(null);

        const productsResponse = await getProducts();

        if (productsResponse.products.length === 0) {
          setProducts([]);
          return;
        }

        const productIds = productsResponse.products.map(product => product.id);

        const quantitiesResponse = await getProductQuantities({
          fields: 'inventory_quantity',
          product_ids: productIds
        });

        const variantQuantityMap = new Map();
        quantitiesResponse.variants.forEach(variant => {
          variantQuantityMap.set(variant.id, variant.inventory_quantity);
        });

        const productsWithQuantities = productsResponse.products.map(product => ({
          ...product,
          variants: product.variants.map(variant => ({
            ...variant,
            inventory_quantity: variantQuantityMap.get(variant.id) ?? variant.inventory_quantity
          }))
        }));

        setProducts(productsWithQuantities);
      } catch (err) {
        setError(err.message || 'Falha ao carregar produtos');
      } finally {
        setLoading(false);
      }
    };

    fetchProductsWithQuantities();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-16 w-16 text-blue-500 dark:text-white animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 p-8">
        <p>Erro ao carregar produtos: {error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 p-8">
        <p>Nenhum produto disponível no momento.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
};

export default ProductsList;
