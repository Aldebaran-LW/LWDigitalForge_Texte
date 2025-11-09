
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingCart, Loader2, ArrowLeft, CheckCircle, Minus, Plus, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWEyMDNkIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY0NzRjYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxXPC90ZXh0Pgo8L3N2Zz4K";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = useCallback(async () => {
    if (product && selectedVariant) {
      const availableQuantity = selectedVariant.inventory_quantity;
      try {
        await addToCart(product, selectedVariant, quantity, availableQuantity);
        toast({
          title: "Adicionado ao Carrinho! 🛒",
          description: `${quantity} x ${product.title} (${selectedVariant.title}) adicionado.`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Ops! Algo deu errado.",
          description: error.message,
        });
      }
    }
  }, [product, selectedVariant, quantity, addToCart, toast]);

  const handleQuantityChange = useCallback((amount) => {
    setQuantity(prevQuantity => {
        const newQuantity = prevQuantity + amount;
        if (newQuantity < 1) return 1;
        
        if(selectedVariant?.manage_inventory) {
            const availableQuantity = selectedVariant.inventory_quantity;
            if (newQuantity > availableQuantity) return availableQuantity;
        }

        return newQuantity;
    });
  }, [selectedVariant]);

  const handlePrevImage = useCallback(() => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1);
    }
  }, [product?.images?.length]);

  const handleNextImage = useCallback(() => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1);
    }
  }, [product?.images?.length]);

  const handleVariantSelect = useCallback((variant) => {
    setSelectedVariant(variant);
    setQuantity(1);

    if (variant.image_url && product?.images?.length > 0) {
      const imageIndex = product.images.findIndex(image => image.url === variant.image_url);
      if (imageIndex !== -1) {
        setCurrentImageIndex(imageIndex);
      }
    }
  }, [product?.images]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: p, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        const fetchedProduct = {
          id: p.id,
          title: p.name,
          subtitle: p.subtitle,
          description: p.description,
          image: p.image_url,
          price_in_cents: p.price * 100,
          currency: 'BRL',
          purchasable: true,
          order: 0,
          site_product_selection: 'lowest_price_first',
          images: [{ url: p.image_url, order: 0, type: 'image' }],
          options: [],
          variants: [{
            id: `variant_${p.id}`,
            title: 'Default',
            image_url: p.image_url,
            sku: null,
            price_in_cents: p.price * 100,
            sale_price_in_cents: null,
            currency: 'BRL',
            currency_info: { code: 'BRL', symbol: 'R$', template: 'R$ $1' },
            price_formatted: `R$ ${p.price.toFixed(2).replace('.', ',')}`,
            sale_price_formatted: null,
            manage_inventory: false,
            weight: null,
            options: [],
            inventory_quantity: 99,
          }],
          collections: [],
          additional_info: [],
          type: { value: 'physical' },
          custom_fields: [],
          related_products: [],
          updated_at: p.created_at,
          ribbon_text: null
        };
        
        setProduct(fetchedProduct);

        if (fetchedProduct.variants && fetchedProduct.variants.length > 0) {
          setSelectedVariant(fetchedProduct.variants[0]);
        }
      } catch (err) {
        setError(err.message || 'Falha ao carregar o produto');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-5rem)]">
        <Loader2 className="h-16 w-16 text-blue-500 dark:text-white animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4">
        <Link to="/produtos" className="inline-flex items-center gap-2 text-gray-700 dark:text-white hover:text-blue-500 transition-colors mb-6">
          <ArrowLeft size={16} />
          Voltar aos Produtos
        </Link>
        <div className="text-center text-red-500 dark:text-red-400 p-8 bg-white/50 dark:bg-white/5 rounded-2xl">
          <XCircle className="mx-auto h-16 w-16 mb-4" />
          <p className="mb-6">Erro ao carregar o produto: {error}</p>
        </div>
      </div>
    );
  }

  const price = selectedVariant?.sale_price_formatted || selectedVariant?.price_formatted;
  const originalPrice = selectedVariant?.sale_price_in_cents ? selectedVariant.price_formatted : null;
  const availableStock = selectedVariant ? selectedVariant.inventory_quantity : 0;
  const isStockManaged = selectedVariant?.manage_inventory ?? false;
  const canAddToCart = !isStockManaged || quantity <= availableStock;

  const currentImage = product.images[currentImageIndex];
  const hasMultipleImages = product.images.length > 1;

  return (
    <>
      <Helmet>
        <title>{product.title} - LWDigitalForge</title>
        <meta name="description" content={product.description?.substring(0, 160) || product.title} />
      </Helmet>
      <div className="max-w-6xl mx-auto py-12 px-4">
        <Link to="/produtos" className="inline-flex items-center gap-2 text-gray-700 dark:text-white hover:text-blue-500 transition-colors mb-6">
          <ArrowLeft size={16} />
          Voltar aos Produtos
        </Link>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 bg-white dark:bg-[#111827]/50 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-blue-500/20">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative">
            <div className="relative overflow-hidden rounded-lg shadow-2xl h-96 md:h-[500px]">
              <img
                src={!currentImage?.url ? placeholderImage : currentImage.url}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {hasMultipleImages && (
                <>
                  <button onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10" aria-label="Previous image"> <ChevronLeft size={20} /> </button>
                  <button onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10" aria-label="Next image"> <ChevronRight size={20} /> </button>
                </>
              )}
              {product.ribbon_text && (
                <div className="absolute top-4 left-4 bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg"> {product.ribbon_text} </div>
              )}
            </div>

            {hasMultipleImages && (
              <div className="flex justify-center gap-2 mt-4">
                {product.images.map((_, index) => (
                  <button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-3 h-3 rounded-full transition-colors ${ index === currentImageIndex ? 'bg-blue-500' : 'bg-gray-300 dark:bg-white/30 hover:bg-gray-400 dark:hover:bg-white/50' }`} aria-label={`Go to image ${index + 1}`} />
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">{product.title}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-300 mb-4">{product.subtitle}</p>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-blue-500 dark:text-blue-400">{price}</span>
              {originalPrice && (
                <span className="text-2xl text-gray-400 line-through">{originalPrice}</span>
              )}
            </div>

            <div className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-300 mb-6" dangerouslySetInnerHTML={{ __html: product.description }} />

            {product.variants.length > 1 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-white mb-2">{product.options[0]?.title || 'Opção'}</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map(variant => (
                    <Button key={variant.id} variant={selectedVariant?.id === variant.id ? 'default' : 'outline'} onClick={() => handleVariantSelect(variant)} className={`transition-all ${selectedVariant?.id === variant.id ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10'}`}> {variant.title} </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300 dark:border-white/20 rounded-full p-1">
                <Button onClick={() => handleQuantityChange(-1)} variant="ghost" size="icon" className="rounded-full h-8 w-8 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"><Minus size={16} /></Button>
                <span className="w-10 text-center text-gray-800 dark:text-white font-bold">{quantity}</span>
                <Button onClick={() => handleQuantityChange(1)} variant="ghost" size="icon" className="rounded-full h-8 w-8 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"><Plus size={16} /></Button>
              </div>
            </div>

            <div className="mt-auto">
              <Button onClick={handleAddToCart} size="lg" className="w-full btn-primary font-semibold py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled={!canAddToCart || !product.purchasable}>
                <ShoppingCart className="mr-2 h-5 w-5" /> Adicionar ao Carrinho
              </Button>

              {isStockManaged && canAddToCart && product.purchasable && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-3 flex items-center justify-center gap-2">
                  <CheckCircle size={16} /> {availableStock} em estoque!
                </p>
              )}
              {isStockManaged && !canAddToCart && product.purchasable && (
                 <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-3 flex items-center justify-center gap-2">
                  <XCircle size={16} /> Estoque insuficiente. Apenas {availableStock} restante(s).
                </p>
              )}
              {!product.purchasable && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-3 flex items-center justify-center gap-2">
                    <XCircle size={16} /> Indisponível no momento
                  </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default ProductDetailPage;
