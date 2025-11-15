import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Loader2, Link as LinkIcon, GitBranch, Image as ImageIcon } from 'lucide-react';

const AdminFormularioApp = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
  
  const [loading, setLoading] = useState(isEditing); // Only show loader if editing

  useEffect(() => {
    const fetchApp = async () => {
      if (!isEditing) return;

      setLoading(true);
      const { data, error } = await supabase.from('registered_apps').select('*').eq('id', id).single();
      if (error) {
        toast({ variant: 'destructive', title: 'Erro ao buscar aplicação', description: error.message });
        navigate('/admin/aplicacoes');
      } else {
        reset(data); // Populate form with existing data
      }
      setLoading(false);
    };
    
    fetchApp();
  }, [id, isEditing, reset, navigate, toast]);

  const onSubmit = async (formData) => {
    const appData = {
        ...formData,
        updated_at: new Date(),
    };

    let error;
    if (isEditing) {
      const { error: updateError } = await supabase.from('registered_apps').update(appData).eq('id', id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('registered_apps').insert(appData);
      error = insertError;
    }

    if (error) {
      toast({ variant: 'destructive', title: `Erro ao salvar aplicação`, description: error.message });
    } else {
      toast({ title: `Aplicação ${isEditing ? 'atualizada' : 'criada'} com sucesso!` });
      navigate('/admin/aplicacoes');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-16 w-16 animate-spin" /></div>;
  }

  return (
    <>
      <Helmet>
        <title>{isEditing ? 'Editar' : 'Adicionar'} Aplicação - Admin</title>
      </Helmet>
      <div>
        <Button variant="ghost" onClick={() => navigate('/admin/aplicacoes')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a lista
        </Button>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          {isEditing ? 'Editar Aplicação' : 'Adicionar Nova Aplicação'}
        </h1>
        
        <motion.form 
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800/50 p-8 rounded-lg shadow-md border border-gray-200 dark:border-white/10 space-y-6"
        >
            {/* General Info */}
            <h2 className="text-xl font-semibold border-b pb-2">Informações da Aplicação</h2>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Nome da Aplicação</label>
              <input type="text" id="name" {...register('name', { required: 'Nome é obrigatório' })} className="w-full p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">Descrição</label>
              <textarea id="description" {...register('description')} rows="3" className="w-full p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="github_repo_url" className="block text-sm font-medium mb-1">URL do Repositório (GitHub)</label>
                   <div className="relative">
                        <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="url" id="github_repo_url" {...register('github_repo_url')} placeholder="https://github.com/user/repo" className="w-full pl-10 p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md" />
                    </div>
                </div>
                <div>
                  <label htmlFor="vercel_deployment_url" className="block text-sm font-medium mb-1">URL do Deploy (Vercel)</label>
                   <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="url" id="vercel_deployment_url" {...register('vercel_deployment_url')} placeholder="https://meu-app.vercel.app" className="w-full pl-10 p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md" />
                    </div>
                </div>
            </div>

            <div>
                <label htmlFor="image_url" className="block text-sm font-medium mb-1">URL da Imagem (Logo)</label>
                <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="url" id="image_url" {...register('image_url')} placeholder="https://.../logo.png" className="w-full pl-10 p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md" />
                </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate('/admin/aplicacoes')}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</> : 'Salvar Aplicação'}
                </Button>
            </div>
        </motion.form>
      </div>
    </>
  );
};

export default AdminFormularioApp;
