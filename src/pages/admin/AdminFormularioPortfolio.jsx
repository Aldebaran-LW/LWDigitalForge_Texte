import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdminFormularioPortfolio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      if (!isEditing) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.from('portfolio').select('*').eq('id', id).single();
      if (error) {
        toast({ variant: 'destructive', title: 'Erro ao buscar item', description: error.message });
        navigate('/admin/portfolio');
      } else {
        const technologiesString = data.technologies ? data.technologies.join(', ') : '';
        reset({
          ...data,
          technologies: technologiesString,
        });
      }
      setLoading(false);
    };
    
    setLoading(true);
    fetchItem();
  }, [id, isEditing, reset, navigate, toast]);

  const onSubmit = async (formData) => {
    const technologiesArray = formData.technologies 
      ? formData.technologies.split(',').map(t => t.trim()).filter(t => t !== '') 
      : [];

    const portfolioData = {
      title: formData.title,
      description: formData.description || null,
      client_name: formData.client_name || null,
      project_type: formData.project_type || 'WEB_APP',
      image_url: formData.image_url || null,
      project_url: formData.project_url || null,
      technologies: technologiesArray,
      featured: formData.featured || false,
      display_order: formData.display_order ? parseInt(formData.display_order) : 0,
      is_active: formData.is_active !== undefined ? formData.is_active : true,
    };

    let error;
    if (isEditing) {
      const { error: updateError } = await supabase.from('portfolio').update(portfolioData).eq('id', id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('portfolio').insert(portfolioData);
      error = insertError;
    }

    if (error) {
      toast({ variant: 'destructive', title: `Erro ao salvar item`, description: error.message });
      console.error('Erro ao salvar:', error);
    } else {
      toast({ title: `Item ${isEditing ? 'atualizado' : 'criado'} com sucesso!` });
      navigate('/admin/portfolio');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-16 w-16 animate-spin" /></div>;
  }

  return (
    <>
      <Helmet>
        <title>{isEditing ? 'Editar' : 'Adicionar'} Portfólio - LWDigitalForge Admin</title>
      </Helmet>
      <div>
        <Button variant="ghost" onClick={() => navigate('/admin/portfolio')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a lista
        </Button>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          {isEditing ? 'Editar Item do Portfólio' : 'Adicionar ao Portfólio'}
        </h1>
        
        <motion.form 
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800/50 p-6 sm:p-8 rounded-lg shadow-md border border-gray-200 dark:border-white/10 space-y-6"
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título do Projeto *</Label>
              <Input 
                id="title"
                type="text" 
                {...register('title', { required: 'Obrigatório' })} 
                className="mt-1"
                placeholder="Ex: Sistema de Gestão Empresarial"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="client_name">Nome do Cliente</Label>
              <Input 
                id="client_name"
                type="text" 
                {...register('client_name')} 
                className="mt-1"
                placeholder="Ex: Empresa XYZ"
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <textarea 
                id="description"
                {...register('description')} 
                rows="4" 
                className="w-full p-2 bg-gray-100 dark:bg-gray-900 border rounded-md mt-1"
                placeholder="Descreva o projeto, tecnologias usadas, desafios superados..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project_type">Tipo de Projeto</Label>
                <select 
                  id="project_type"
                  {...register('project_type')} 
                  className="w-full p-2 bg-gray-100 dark:bg-gray-900 border rounded-md mt-1"
                >
                  <option value="WEB_APP">Aplicação Web</option>
                  <option value="SITE">Site Institucional</option>
                  <option value="BOT">Bot Telegram</option>
                  <option value="OUTRO">Outro</option>
                </select>
              </div>

              <div>
                <Label htmlFor="display_order">Ordem de Exibição</Label>
                <Input 
                  id="display_order"
                  type="number" 
                  {...register('display_order')} 
                  className="mt-1"
                  placeholder="0"
                  defaultValue={0}
                />
                <p className="text-xs text-gray-500 mt-1">Menor número aparece primeiro</p>
              </div>
            </div>

            <div>
              <Label htmlFor="image_url">URL da Imagem</Label>
              <Input 
                id="image_url"
                type="url" 
                {...register('image_url')} 
                className="mt-1"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div>
              <Label htmlFor="project_url">URL do Projeto (Opcional)</Label>
              <Input 
                id="project_url"
                type="url" 
                {...register('project_url')} 
                className="mt-1"
                placeholder="https://projeto.com"
              />
            </div>

            <div>
              <Label htmlFor="technologies">Tecnologias (Separe por vírgula)</Label>
              <Input 
                id="technologies"
                type="text" 
                {...register('technologies')} 
                className="mt-1"
                placeholder="React, Node.js, PostgreSQL, Tailwind CSS"
              />
              <p className="text-xs text-gray-500 mt-1">Ex: React, Node.js, PostgreSQL</p>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  {...register('featured')} 
                  className="w-4 h-4"
                />
                <span className="text-sm">Destaque (Featured)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  {...register('is_active')} 
                  defaultChecked
                  className="w-4 h-4"
                />
                <span className="text-sm">Ativo</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="btn-primary">
              {isEditing ? 'Atualizar' : 'Criar'} Item
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin/portfolio')}>
              Cancelar
            </Button>
          </div>
        </motion.form>
      </div>
    </>
  );
};

export default AdminFormularioPortfolio;
