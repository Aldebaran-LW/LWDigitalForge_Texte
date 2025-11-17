
import { supabase } from '@/lib/customSupabaseClient';

// Helper para formatar o valor monetário
export const formatCurrency = (valueInCents) => {
  const valueInReais = valueInCents / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valueInReais);
};

export const getProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('registered_apps')
      .select('*')
      .order('name', { ascending: true });
      
    if (error) {
      console.error('Erro ao buscar produtos do Supabase:', error.message);
      throw new Error(`Falha ao carregar produtos: ${error.message}`);
    }
    return data;
  } catch (error) {
    console.error('Erro na função getProducts:', error.message);
    throw new Error('Falha ao carregar produtos. Verifique o console para mais detalhes.');
  }
};

export const getProduct = async (id) => {
  try {
    const { data, error } = await supabase
      .from('registered_apps')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Erro ao buscar o produto com ID ${id}:`, error.message);
      throw new Error(`Falha ao carregar o produto: ${error.message}`);
    }
    
    return data;
  } catch (error) {
     console.error('Erro na função getProduct:', error.message);
    throw new Error('Falha ao carregar dados do produto. Verifique o console para mais detalhes.');
  }
};

// Placeholder function to fix the import error
export const getProductQuantities = async () => {
  console.warn('A função getProductQuantities é um placeholder e ainda não busca dados reais de estoque.');
  // Por enquanto, retorna um objeto vazio para evitar quebrar a aplicação
  return {};
};
