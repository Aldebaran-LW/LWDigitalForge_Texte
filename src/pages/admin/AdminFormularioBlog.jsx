import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { slugify } from '@/lib/slugify';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CATEGORIES = ['Geral', 'Educação', 'Produto', 'Case', 'Técnico', 'Conversão'];

const AdminFormularioBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    defaultValues: { category: 'Geral', is_published: false, author_name: 'LWDigitalForge' },
  });
  const [loading, setLoading] = useState(true);

  const titleWatch = watch('title');

  useEffect(() => {
    if (!isEditing && titleWatch) {
      setValue('slug', slugify(titleWatch), { shouldDirty: true });
    }
  }, [titleWatch, isEditing, setValue]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!isEditing) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).single();
      if (error) {
        toast({ variant: 'destructive', title: 'Erro', description: error.message });
        navigate('/admin/blog');
      } else {
        reset({
          ...data,
          is_published: data.is_published ? 'true' : 'false',
        });
      }
      setLoading(false);
    };
    fetchPost();
  }, [id, isEditing, reset, navigate, toast]);

  const onSubmit = async (formData) => {
    const slug = slugify(formData.slug || formData.title);
    if (!slug) {
      toast({ variant: 'destructive', title: 'Slug inválido' });
      return;
    }

    const isPublished = formData.is_published === true || formData.is_published === 'true';
    const payload = {
      slug,
      title: formData.title,
      excerpt: formData.excerpt || null,
      content: formData.content || '',
      cover_image_url: formData.cover_image_url || null,
      category: formData.category || 'Geral',
      meta_title: formData.meta_title || null,
      meta_description: formData.meta_description || null,
      author_name: formData.author_name || 'LWDigitalForge',
      is_published: isPublished,
      published_at: isPublished
        ? formData.published_at || new Date().toISOString()
        : null,
    };

    let error;
    if (isEditing) {
      ({ error } = await supabase.from('blog_posts').update(payload).eq('id', id));
    } else {
      ({ error } = await supabase.from('blog_posts').insert(payload));
    }

    if (error) {
      toast({ variant: 'destructive', title: 'Erro ao salvar', description: error.message });
    } else {
      toast({ title: `Artigo ${isEditing ? 'atualizado' : 'criado'} com sucesso` });
      navigate('/admin/blog');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isEditing ? 'Editar' : 'Novo'} artigo - Admin</title>
      </Helmet>
      <Button variant="ghost" onClick={() => navigate('/admin/blog')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        {isEditing ? 'Editar artigo' : 'Novo artigo'}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-white/10 space-y-6 max-w-3xl"
      >
        <div>
          <Label htmlFor="title">Título *</Label>
          <Input id="title" {...register('title', { required: 'Obrigatório' })} className="mt-1" />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <Label htmlFor="slug">Slug (URL) *</Label>
          <Input id="slug" {...register('slug', { required: 'Obrigatório' })} className="mt-1 font-mono text-sm" />
          <p className="text-xs text-gray-500 mt-1">/blog/seu-slug-aqui</p>
        </div>

        <div>
          <Label htmlFor="excerpt">Resumo</Label>
          <textarea
            id="excerpt"
            rows={2}
            {...register('excerpt')}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <div>
          <Label htmlFor="content">Conteúdo (Markdown) *</Label>
          <textarea
            id="content"
            rows={14}
            {...register('content', { required: 'Obrigatório' })}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
            placeholder="## Título da seção&#10;&#10;Parágrafo com **negrito** e [link](/produtos)."
          />
          {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Categoria</Label>
            <select
              id="category"
              {...register('category')}
              className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="cover_image_url">URL da capa</Label>
            <Input id="cover_image_url" {...register('cover_image_url')} className="mt-1" />
          </div>
        </div>

        <div>
          <Label htmlFor="meta_title">Meta title (SEO)</Label>
          <Input id="meta_title" {...register('meta_title')} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="meta_description">Meta description (SEO)</Label>
          <textarea
            id="meta_description"
            rows={2}
            {...register('meta_description')}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('is_published')} className="rounded" />
            Publicar agora
          </label>
        </div>

        <Button type="submit" className="btn-primary">
          Salvar artigo
        </Button>
      </form>
    </>
  );
};

export default AdminFormularioBlog;
