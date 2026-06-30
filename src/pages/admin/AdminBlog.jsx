import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Loader2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      toast({ variant: 'destructive', title: 'Erro ao carregar blog', description: fetchError.message });
    } else {
      setPosts(data || []);
      setError(null);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (id) => {
    const { error: delError } = await supabase.from('blog_posts').delete().eq('id', id);
    if (delError) {
      toast({ variant: 'destructive', title: 'Erro ao excluir', description: delError.message });
    } else {
      toast({ title: 'Artigo excluído' });
      fetchPosts();
    }
  };

  const handleTogglePublish = async (post) => {
    const nextPublished = !post.is_published;
    const payload = {
      is_published: nextPublished,
      published_at: nextPublished
        ? post.published_at || new Date().toISOString()
        : null,
    };
    const { error: updError } = await supabase.from('blog_posts').update(payload).eq('id', post.id);
    if (updError) {
      toast({ variant: 'destructive', title: 'Erro ao atualizar', description: updError.message });
    } else {
      toast({ title: nextPublished ? 'Artigo publicado' : 'Artigo despublicado' });
      fetchPosts();
    }
  };

  return (
    <>
      <Helmet>
        <title>Gerenciar Blog - LWDigitalForge Admin</title>
      </Helmet>
      <div className="px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Blog</h1>
          <Button asChild className="btn-primary w-full sm:w-auto min-h-[44px]">
            <Link to="/admin/blog/novo">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo artigo
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded text-sm">
            <AlertTriangle className="inline mr-2 h-4 w-4" />
            {error}
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Execute a migration <code className="text-xs">20250603000000_blog_posts.sql</code> no Supabase se a tabela ainda não existir.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-white/10 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800 text-gray-500">
                <tr>
                  <th className="px-4 py-3">Título</th>
                  <th className="px-4 py-3 hidden md:table-cell">Categoria</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Slug</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      Nenhum artigo.{' '}
                      <Link to="/admin/blog/novo" className="text-blue-500 hover:underline">
                        Criar o primeiro
                      </Link>
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <motion.tr
                      key={post.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-t dark:border-gray-700"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white max-w-[200px] truncate">
                        {post.title}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">{post.category}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-gray-500 font-mono text-xs">
                        {post.slug}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            post.is_published
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                          }`}
                        >
                          {post.is_published ? 'Publicado' : 'Rascunho'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleTogglePublish(post)}
                            title={post.is_published ? 'Despublicar' : 'Publicar'}
                          >
                            {post.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button asChild variant="ghost" size="icon">
                            <Link to={`/admin/blog/${post.id}/editar`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir artigo?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Isso remove permanentemente &quot;{post.title}&quot;.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(post.id)}>
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminBlog;
