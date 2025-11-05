
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';

const AdminFormularioProduto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductTypes = async () => {
      const { data, error } = await supabase.from('product_types').select('*').order('name');
      if (error) {
        toast({ variant: 'destructive', title: 'Erro ao buscar tipos', description: error.message });
      } else {
        setProductTypes(data);
      }
    };

    const fetchProduct = async () => {
      if (!isEditing) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error) {
        toast({ variant: 'destructive', title: 'Erro ao buscar produto', description: error.message });
        navigate('/admin/produtos');
      } else {
        // Populate form with existing data
        reset({
          name: data.name,
          product_type_id: data.product_type_id,
          hostinger_product_id: data.hostinger_product_id,
          price_monthly: data.price_monthly ? data.price_monthly / 100 : '',
          price_lifetime: data.price_lifetime ? data.price_lifetime / 100 : '',
          shortDescription: data.short_description,
          detailedDescription: data.detailed_description,
          features: data.features,
          status: data.status,
          integration_endpoint: data.integration_endpoint,
          integration_api_key: data.integration_api_key,
        });
      }
      setLoading(false);
    };
    
    setLoading(true);
    Promise.all([fetchProductTypes(), fetchProduct()]);
  }, [id, isEditing, reset, navigate, toast]);

  const onSubmit = async (formData) => {
    const productData = {
      name: formData.name,
      product_type_id: formData.product_type_id,
      hostinger_product_id: formData.hostinger_product_id,
      price_monthly: formData.price_monthly ? Math.round(formData.price_monthly * 100) : null,
      price_lifetime: formData.price_lifetime ? Math.round(formData.price_lifetime * 100) : null,
      short_description: formData.shortDescription,
      detailed_description: formData.detailedDescription,
      features: formData.features,
      status: formData.status,
      integration_endpoint: formData.integration_endpoint,
      integration_api_key: formData.integration_api_key,
      updated_at: new Date(),
    };

    let error;
    if (isEditing) {
      const { error: updateError } = await supabase.from('products').update(productData).eq('id', id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('products').insert(productData);
      error = insertError;
    }

    if (error) {
      toast({ variant: 'destructive', title: `Erro ao salvar produto`, description: error.message });
    } else {
      toast({ title: `Produto ${isEditing ? 'atualizado' : 'criado'} com sucesso!` });
      navigate('/admin/produtos');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-16 w-16 animate-spin" /></div>;
  }

  return (
    <>
      <Helmet>
        <title>{isEditing ? 'Editar' : 'Adicionar'} Produto - LWDigitalForge Admin</title>
      </Helmet>
      <div>
        <Button variant="ghost" onClick={() => navigate('/admin/produtos')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a lista
        </Button>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          {isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}
        </h1>
        
        <motion.form 
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800/50 p-8 rounded-lg shadow-md border border-gray-200 dark:border-white/10 space-y-6"
        >
            {/* General Info */}
            <h2 className="text-xl font-semibold border-b pb-2">Informações Gerais</h2>
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Nome do Produto</label>
              <input type="text" id="name" {...register('name', { required: 'Nome é obrigatório' })} className="w-full p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="product_type_id" className="block text-sm font-medium mb-1">Tipo de Produto</label>
                  <select id="product_type_id" {...register('product_type_id', { required: 'Tipo é obrigatório' })} className="w-full p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md">
                    <option value="">Selecione um tipo</option>
                    {productTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
                  </select>
                  {errors.product_type_id && <p className="text-red-500 text-xs mt-1">{errors.product_type_id.message}</p>}
                </div>
                <div>
                  <label htmlFor="hostinger_product_id" className="block text-sm font-medium mb-1">Hostinger Product ID</label>
                  <input type="text" id="hostinger_product_id" {...register('hostinger_product_id')} className="w-full p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <label className="flex items-center cursor-pointer">
                      <input type="checkbox" {...register('status')} defaultChecked className="sr-only peer" />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ms-3 text-sm font-medium">Ativo</span>
                  </label>
                </div>
            </div>

            <div>
              <label htmlFor="shortDescription" className="block text-sm font-medium mb-1">Descrição Curta</label>
              <textarea id="shortDescription" {...register('shortDescription')} rows="2" className="w-full p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md"></textarea>
            </div>
            
            <div>
              <label htmlFor="detailedDescription" className="block text-sm font-medium mb-1">Descrição Detalhada</label>
              <textarea id="detailedDescription" {...register('detailedDescription')} rows="5" className="w-full p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md"></textarea>
            </div>
            
            <div>
              <label htmlFor="features" className="block text-sm font-medium mb-1">Recursos (separados por vírgula)</label>
              <input type="text" id="features" {...register('features')} className="w-full p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md" />
            </div>

            {/* Pricing Section */}
            <h2 className="text-xl font-semibold border-b pt-4 pb-2">Precificação</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="price_monthly" className="block text-sm font-medium mb-1">Licença Mensal (R$)</label>
                  <input type="number" id="price_monthly" step="0.01" {...register('price_monthly')} className="w-full p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md" />
                </div>
                <div>
                  <label htmlFor="price_lifetime" className="block text-sm font-medium mb-1">Licença Vitalícia (R$)</label>
                  <input type="number" id="price_lifetime" step="0.01" {...register('price_lifetime')} className="w-full p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md" />
                </div>
            </div>

            {/* Integration Section */}
            <h2 className="text-xl font-semibold border-b pt-4 pb-2">Configuração da Integração</h2>
             <div>
              <label htmlFor="integration_endpoint" className="block text-sm font-medium mb-1">Endpoint da Integração (URL)</label>
              <input type="text" id="integration_endpoint" {...register('integration_endpoint')} className="w-full p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md" />
            </div>
             <div>
              <label htmlFor="integration_api_key" className="block text-sm font-medium mb-1">Chave de API do Produto</label>
              <input type="text" id="integration_api_key" {...register('integration_api_key')} className="w-full p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md" />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate('/admin/produtos')}>Cancelar</Button>
                <Button type="submit" className="btn-primary">Salvar Produto</Button>
            </div>
        </motion.form>
      </div>
    </>
  );
};

export default AdminFormularioProduto;
