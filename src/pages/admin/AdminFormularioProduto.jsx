
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { heroGalleryFromTextarea, heroGalleryToTextarea } from '@/lib/galleryUrls';

const AdminFormularioProduto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!isEditing) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.from('registered_apps').select('*').eq('id', id).single();
      if (error) {
        toast({ variant: 'destructive', title: 'Erro ao buscar produto', description: error.message });
        navigate('/admin/produtos');
      } else {
        // Converte o array de features de volta para string separada por vírgula para exibir no input
        const featuresString = data.features ? data.features.join(', ') : '';
        
        reset({
          ...data,
          features: featuresString,
          price_monthly: data.price_monthly ? data.price_monthly / 100 : '',
          price_annual: data.price_annual ? data.price_annual / 100 : '',
          price_lifetime: data.price_lifetime ? data.price_lifetime / 100 : '',
          hero_gallery_urls: heroGalleryToTextarea(data.hero_gallery_urls),
        });
      }
      setLoading(false);
    };
    
    setLoading(true);
    fetchProduct();
  }, [id, isEditing, reset, navigate, toast]);

  const onSubmit = async (formData) => {
    // Converte a string de features em um array
    const featuresArray = formData.features 
      ? formData.features.split(',').map(f => f.trim()).filter(f => f !== '') 
      : [];

    const productData = {
      name: formData.name,
      description: formData.description || null,
      detailed_description: formData.detailed_description || null, // Novo Campo
      features: featuresArray, // Novo Campo
      image_url: formData.image_url || null,
      hero_gallery_urls: heroGalleryFromTextarea(formData.hero_gallery_urls),
      github_repo_url: formData.github_repo_url || null,
      vercel_deployment_url: formData.vercel_deployment_url || null,
      
      // Preços convertidos para centavos
      price_monthly: formData.price_monthly ? Math.round(formData.price_monthly * 100) : null,
      price_annual: formData.price_annual ? Math.round(formData.price_annual * 100) : null,
      price_lifetime: formData.price_lifetime ? Math.round(formData.price_lifetime * 100) : null,
      trial_period_days: formData.trial_period_days ? parseInt(formData.trial_period_days) : null,
      
      updated_at: new Date().toISOString(),
    };

    let error;
    if (isEditing) {
      const { error: updateError } = await supabase.from('registered_apps').update(productData).eq('id', id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('registered_apps').insert(productData);
      error = insertError;
    }

    if (error) {
      toast({ variant: 'destructive', title: `Erro ao salvar produto`, description: error.message });
      console.error('Erro ao salvar:', error);
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
            <h2 className="text-xl font-semibold border-b pb-2">Dados Principais</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Nome do Produto *</label>
              <input type="text" {...register('name', { required: 'Obrigatório' })} className="w-full p-2 bg-gray-100 dark:bg-gray-900 border rounded-md" />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Resumo Curto</label>
              <textarea {...register('description')} rows="2" className="w-full p-2 bg-gray-100 dark:bg-gray-900 border rounded-md" placeholder="Aparece no card do produto" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descrição Detalhada (Vendas)</label>
              <textarea {...register('detailed_description')} rows="6" className="w-full p-2 bg-gray-100 dark:bg-gray-900 border rounded-md" placeholder="Descreva todos os benefícios do produto aqui..." />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Recursos / Benefícios (Separe por vírgula)</label>
              <input type="text" {...register('features')} className="w-full p-2 bg-gray-100 dark:bg-gray-900 border rounded-md" placeholder="Ex: Suporte 24h, Backup Automático, Acesso Vitalício" />
            </div>

            <div>
              <label htmlFor="image_url" className="block text-sm font-medium mb-1">URL da Imagem (capa)</label>
              <input type="url" id="image_url" {...register('image_url')} className="w-full p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md" placeholder="https://exemplo.com/imagem.jpg" />
            </div>

            <div>
              <label htmlFor="hero_gallery_urls" className="block text-sm font-medium mb-1">
                URLs extra para carrossel no card (uma por linha)
              </label>
              <textarea
                id="hero_gallery_urls"
                rows={3}
                {...register('hero_gallery_urls')}
                className="w-full p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md"
                placeholder="https://.../foto2.jpg&#10;https://.../foto3.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Opcional. Com duas ou mais URLs (capa + extras), o card alterna as imagens em fade.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="github_repo_url" className="block text-sm font-medium mb-1">URL do Repositório GitHub</label>
                <input type="url" id="github_repo_url" {...register('github_repo_url')} className="w-full p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md" placeholder="https://github.com/usuario/repositorio" />
              </div>
              <div>
                <label htmlFor="vercel_deployment_url" className="block text-sm font-medium mb-1">URL de Deploy (Vercel)</label>
                <input type="url" id="vercel_deployment_url" {...register('vercel_deployment_url')} className="w-full p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md" placeholder="https://app.vercel.app" />
              </div>
            </div>

            <h2 className="text-xl font-semibold border-b pt-4 pb-2">Planos de Preço (R$)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="price_monthly" className="block text-sm font-medium mb-1">Preço Mensal (R$)</label>
                <input type="number" id="price_monthly" step="0.01" min="0" {...register('price_monthly')} className="w-full p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md" placeholder="0.00" />
              </div>
              <div>
                <label htmlFor="price_annual" className="block text-sm font-medium mb-1">Preço Anual (R$)</label>
                <input type="number" id="price_annual" step="0.01" min="0" {...register('price_annual')} className="w-full p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md" placeholder="0.00" />
              </div>
              <div>
                <label htmlFor="price_lifetime" className="block text-sm font-medium mb-1">Preço Vitalício (R$)</label>
                <input type="number" id="price_lifetime" step="0.01" min="0" {...register('price_lifetime')} className="w-full p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md" placeholder="0.00" />
              </div>
            </div>

            <div>
              <label htmlFor="trial_period_days" className="block text-sm font-medium mb-1">Período de Teste (dias)</label>
              <input type="number" id="trial_period_days" min="0" {...register('trial_period_days')} className="w-full p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md" placeholder="0" />
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
