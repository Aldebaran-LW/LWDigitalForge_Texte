
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Edit, Trash2, Loader2, AlertTriangle, X } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose
} from "@/components/ui/dialog";
import { useForm } from 'react-hook-form';

const AdminTiposDeProduto = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetchTypes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('product_types').select('*').order('name');
    if (error) {
      setError(error.message);
      toast({ variant: 'destructive', title: 'Erro ao carregar tipos', description: error.message });
    } else {
      setTypes(data);
      setError(null);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  const openDialogForEdit = (type) => {
    setEditingType(type);
    setValue('name', type.name);
    setIsDialogOpen(true);
  };

  const openDialogForNew = () => {
    setEditingType(null);
    reset({ name: '' });
    setIsDialogOpen(true);
  };

  const onSubmit = async (formData) => {
    let error;
    if (editingType) {
      // Update
      const { error: updateError } = await supabase.from('product_types').update({ name: formData.name, updated_at: new Date() }).eq('id', editingType.id);
      error = updateError;
    } else {
      // Insert
      const { error: insertError } = await supabase.from('product_types').insert({ name: formData.name });
      error = insertError;
    }

    if (error) {
      toast({ variant: 'destructive', title: 'Erro ao salvar tipo', description: error.message });
    } else {
      toast({ title: `Tipo ${editingType ? 'atualizado' : 'criado'} com sucesso!` });
      setIsDialogOpen(false);
      fetchTypes();
    }
  };

  const handleDelete = async (typeId) => {
    const { error } = await supabase.from('product_types').delete().eq('id', typeId);
    if (error) {
      toast({ variant: 'destructive', title: 'Erro ao excluir tipo', description: error.message });
    } else {
      toast({ title: 'Tipo excluído com sucesso!' });
      fetchTypes();
    }
  };

  return (
    <>
      <Helmet>
        <title>Tipos de Produto - LWDigitalForge Admin</title>
      </Helmet>
      <div className="px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Gerenciar Tipos de Produto</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openDialogForNew} className="btn-primary w-full sm:w-auto min-h-[44px]">
                <PlusCircle className="mr-2 h-4 w-4" /> 
                <span className="hidden sm:inline">Adicionar Novo Tipo</span>
                <span className="sm:hidden">Novo Tipo</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] sm:max-w-[425px]">
              <form onSubmit={handleSubmit(onSubmit)}>
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">{editingType ? 'Editar' : 'Adicionar'} Tipo de Produto</DialogTitle>
                  <DialogDescription className="text-sm">
                    {editingType ? 'Altere o nome do tipo de produto.' : 'Crie um novo tipo para seus produtos.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 sm:gap-4 py-2 sm:py-4">
                  <label htmlFor="name" className="text-sm">Nome</label>
                  <input
                    id="name"
                    {...register('name', { required: 'O nome é obrigatório.' })}
                    className="p-2 sm:p-3 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md min-h-[48px] text-base"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button type="submit" className="w-full sm:w-auto min-h-[44px]">Salvar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48 sm:h-64"><Loader2 className="h-12 w-12 sm:h-16 sm:w-16 animate-spin" /></div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-3 sm:p-4 rounded" role="alert">
            <p className="font-bold flex items-center text-sm sm:text-base"><AlertTriangle className="mr-2 h-4 w-4 sm:h-5 sm:w-5"/>Erro</p>
            <p className="text-xs sm:text-sm mt-1">{error}</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800/50 rounded-lg shadow-md border border-gray-200 dark:border-white/10 overflow-x-auto -mx-4 sm:mx-0"
          >
            <div className="min-w-full inline-block align-middle">
              <table className="w-full text-xs sm:text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-3 sm:px-4 md:px-6 py-2 sm:py-3">Nome</th>
                    <th scope="col" className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {types.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400 text-sm">Nenhum tipo de produto encontrado.</td>
                    </tr>
                  ) : types.map((type, index) => (
                    <motion.tr 
                        key={type.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-white dark:bg-gray-800/80 border-b dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-white/5"
                    >
                      <th scope="row" className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-medium text-gray-900 dark:text-white">
                        {type.name}
                      </th>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700 min-h-[36px] min-w-[36px]" onClick={() => openDialogForEdit(type)}>
                              <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                              <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 min-h-[36px] min-w-[36px]">
                                      <Trash2 className="h-4 w-4" />
                                  </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                                  <AlertDialogHeader>
                                      <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                          Esta ação não pode ser desfeita. Isso excluirá o tipo "{type.name}".
                                      </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                      <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(type.id)} className="w-full sm:w-auto bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
                                  </AlertDialogFooter>
                              </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default AdminTiposDeProduto;
