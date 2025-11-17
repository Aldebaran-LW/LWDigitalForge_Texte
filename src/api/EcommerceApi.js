
import { supabase } from '@/lib/customSupabaseClient';

// Helper para formatar o preço em Reais (BRL)
export const formatCurrency = (priceInCents) => {
  if (priceInCents === null || priceInCents === undefined) {
    return '';
  }
  const amount = priceInCents / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

// Transforma um item do banco de dados no formato que o frontend espera
const transformProductData = (app) => {
  if (!app) return null;

  const variants = [];

  if (app.price_monthly !== null) {
    variants.push({
      id: `${app.id}_monthly`,
      title: 'Mensal',
      price_in_cents: app.price_monthly,
      price_formatted: formatCurrency(app.price_monthly),
      inventory_quantity: 100, 
      manage_inventory: false,
    });
  }

  if (app.price_yearly !== null) {
    variants.push({
      id: `${app.id}_yearly`,
      title: 'Anual',
      price_in_cents: app.price_yearly,
      price_formatted: formatCurrency(app.price_yearly),
      inventory_quantity: 100,
      manage_inventory: false,
    });
  }
  
  return {
    id: app.id,
    title: app.name,
    subtitle: app.description,
    image: app.image_url,
    trial_days: app.trial_days, // <-- Adicionado
    purchasable: true,
    currency: 'BRL',
    variants: variants, // <-- Variantes dinâmicas
    options: variants.length > 1 ? [{ title: 'Plano' }] : [], // Opção para escolher o plano
    images: app.image_url ? [{ url: app.image_url, order: 1, type: 'main' }] : [],
    collections: [],
    additional_info: [],
    type: { value: 'app' },
    custom_fields: [],
    related_products: [],
    updated_at: app.updated_at,
    created_at: app.created_at,
  };
};

/**
 * Busca a lista de produtos do Supabase
 */
export async function getProducts(options = {}) {
  const { data, error } = await supabase
    .from('registered_apps')
    .select('*');

  if (error) {
    console.error('Erro ao buscar produtos do Supabase:', error);
    throw new Error(`Falha ao carregar produtos: ${error.message}`);
  }

  const products = data.map(transformProductData);

  return {
    count: products.length,
    offset: 0,
    limit: options.limit || products.length,
    products: products,
  };
}

/**
 * Busca um único produto pelo ID do Supabase
 */
export async function getProduct(id, options = {}) {
  const { data, error } = await supabase
    .from('registered_apps')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Erro ao buscar produto ${id}:`, error);
    throw new Error(`Não foi possível encontrar o produto: ${error.message}`);
  }

  return transformProductData(data);
}


/**
 * Simula a busca por quantidade de estoque.
 * Por enquanto, apenas retorna que há estoque para os produtos solicitados.
 */
export async function getProductQuantities({ product_ids }) {
    if (!product_ids) return { variants: [] };
  
    const variants = product_ids.map(id => ({
        id: id, // O ID da variante agora é mais complexo, mas para estoque ainda podemos simplificar
        inventory_quantity: 100,
    }));

    return { variants };
}


/**
 * Função de Finalização de Compra (Checkout) - NÃO IMPLEMENTADA
 * Esta função precisa ser conectada a um provedor de pagamento como Stripe ou Mercado Pago.
 */
export async function initializeCheckout(params) {
  console.warn("A função initializeCheckout não está implementada.");
  console.warn("É necessário integrar um provedor de pagamentos (Stripe, Mercado Pago, etc.)");

  // Para evitar que o app quebre, lançamos um erro claro.
  throw new Error('A finalização da compra ainda não foi configurada.');
  
}

