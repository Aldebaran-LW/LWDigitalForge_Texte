import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  CalendarDays, 
  Ban,
  Loader2,
  Search,
  User,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Infinity,
  Mail
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const AdminControleAcesso = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductFilter, setSelectedProductFilter] = useState('all');
  
  // Estados do modal de controle
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionType, setActionType] = useState('trial'); // 'trial', 'lifetime', 'revoke'
  const [trialDays, setTrialDays] = useState(7);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchUsers(), fetchProducts()]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os dados."
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, phone, role')
        .order('full_name', { ascending: true });

      if (error) throw error;

      // Buscar acessos de cada usuário
      const usersWithAccess = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Buscar trials ativos
          const { data: trials } = await supabase
            .from('user_trials')
            .select('app_id, expires_at, is_active')
            .eq('user_id', profile.id)
            .eq('is_active', true);

          // Buscar compras/assinaturas aprovadas
          const { data: purchases } = await supabase
            .from('user_purchases')
            .select('app_id, purchase_type, status, expires_at')
            .eq('user_id', profile.id)
            .eq('status', 'APPROVED');

          return {
            ...profile,
            trials: trials || [],
            purchases: purchases || [],
          };
        })
      );

      setUsers(usersWithAccess);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('registered_apps')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  };

  const handleOpenModal = (user, productId = null) => {
    setSelectedUser(user);
    setSelectedProduct(productId);
    setActionType('trial');
    setTrialDays(7);
    setIsModalOpen(true);
  };

  const handleExecuteAction = async () => {
    if (!selectedProduct || !selectedUser) {
      toast({ 
        variant: "destructive", 
        title: "Erro", 
        description: "Selecione um produto." 
      });
      return;
    }

    setProcessingAction(true);
    try {
      // 1. CONCEDER VITALÍCIO
      if (actionType === 'lifetime') {
        // Remove trials existentes
        await supabase
          .from('user_trials')
          .delete()
          .match({ user_id: selectedUser.id, app_id: selectedProduct });

        // Insere compra vitalícia
        const purchaseData = {
          user_id: selectedUser.id,
          app_id: selectedProduct,
          purchase_type: 'LIFETIME',
          status: 'APPROVED',
          payment_method: 'ADMIN_GRANT',
          amount_paid: 0,
          purchased_at: new Date().toISOString(),
          expires_at: null
        };
        
        const { error } = await supabase.from('user_purchases').insert(purchaseData);
        if (error) throw error;

        toast({ 
          title: "✅ Sucesso", 
          description: `Acesso VITALÍCIO concedido a ${selectedUser.full_name || selectedUser.email}.` 
        });
      } 
      
      // 2. CONCEDER TRIAL
      else if (actionType === 'trial') {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + parseInt(trialDays));

        const { error } = await supabase.from('user_trials').upsert({
          user_id: selectedUser.id,
          app_id: selectedProduct,
          started_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
          is_active: true
        }, { onConflict: 'user_id, app_id' });

        if (error) throw error;

        toast({ 
          title: "✅ Sucesso", 
          description: `Trial de ${trialDays} dias concedido a ${selectedUser.full_name || selectedUser.email}.` 
        });
      } 
      
      // 3. REVOGAR ACESSO
      else if (actionType === 'revoke') {
        // Desativa trials
        await supabase.from('user_trials')
          .update({ is_active: false, expires_at: new Date().toISOString() })
          .match({ user_id: selectedUser.id, app_id: selectedProduct });

        // Cancela compras/assinaturas
        await supabase.from('user_purchases')
          .update({ status: 'CANCELLED', expires_at: new Date().toISOString() })
          .match({ user_id: selectedUser.id, app_id: selectedProduct });

        toast({ 
          title: "✅ Acesso Revogado", 
          description: `Todo acesso ao produto foi removido de ${selectedUser.full_name || selectedUser.email}.` 
        });
      }

      setIsModalOpen(false);
      await fetchData(); // Recarregar dados
    } catch (error) {
      console.error(error);
      toast({ 
        variant: "destructive", 
        title: "Erro", 
        description: error.message || "Não foi possível executar a ação." 
      });
    } finally {
      setProcessingAction(false);
    }
  };

  const getUserAccessForProduct = (user, productId) => {
    const trial = user.trials?.find(t => t.app_id === productId);
    const purchase = user.purchases?.find(p => p.app_id === productId);
    
    if (purchase) {
      if (purchase.purchase_type === 'LIFETIME') {
        return { type: 'lifetime', status: 'active' };
      }
      if (purchase.expires_at && new Date(purchase.expires_at) > new Date()) {
        return { type: 'subscription', status: 'active', expiresAt: purchase.expires_at };
      }
      return { type: 'subscription', status: 'expired' };
    }
    
    if (trial && trial.is_active) {
      if (new Date(trial.expires_at) > new Date()) {
        return { type: 'trial', status: 'active', expiresAt: trial.expires_at };
      }
      return { type: 'trial', status: 'expired' };
    }
    
    return { type: 'none', status: 'none' };
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedProductFilter === 'all') {
      return matchesSearch;
    }
    
    const access = getUserAccessForProduct(user, selectedProductFilter);
    return matchesSearch && access.status === 'active';
  });

  return (
    <>
      <Helmet>
        <title>Controle de Acesso - LWDigitalForge Admin</title>
      </Helmet>
      
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Controle de Acesso Manual
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gerencie manualmente o acesso dos usuários às aplicações
          </p>
        </div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#0D1526] rounded-xl border border-gray-200/80 dark:border-white/6 p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">Buscar Usuário</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Filtrar por Produto</Label>
              <Select value={selectedProductFilter} onValueChange={setSelectedProductFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os produtos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os produtos</SelectItem>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Tabela de Controle */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 text-amber-500 animate-spin" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[#0D1526] rounded-xl border border-gray-200/80 dark:border-white/6 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Usuário
                    </th>
                    {products.map(product => (
                      <th key={product.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {product.name}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={products.length + 2} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        Nenhum usuário encontrado.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, userIndex) => {
                      const hasAnyAccess = products.some(p => {
                        const access = getUserAccessForProduct(user, p.id);
                        return access.status === 'active';
                      });

                      return (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: userIndex * 0.05 }}
                          className="hover:bg-gray-50 dark:hover:bg-white/5"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-semibold">
                                {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {user.full_name || 'Sem nome'}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          {products.map(product => {
                            const access = getUserAccessForProduct(user, product.id);
                            return (
                              <td key={product.id} className="px-4 py-4 text-center">
                                {access.status === 'active' ? (
                                  <div className="flex flex-col items-center gap-1">
                                    {access.type === 'lifetime' ? (
                                      <>
                                        <Infinity className="h-5 w-5 text-green-500" />
                                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">Vitalício</span>
                                      </>
                                    ) : access.type === 'trial' ? (
                                      <>
                                        <Clock className="h-5 w-5 text-blue-500" />
                                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Trial</span>
                                        <span className="text-xs text-gray-500">
                                          {new Date(access.expiresAt).toLocaleDateString('pt-BR')}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="h-5 w-5 text-purple-500" />
                                        <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Ativo</span>
                                        {access.expiresAt && (
                                          <span className="text-xs text-gray-500">
                                            {new Date(access.expiresAt).toLocaleDateString('pt-BR')}
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </div>
                                ) : (
                                  <XCircle className="h-5 w-5 text-gray-300 dark:text-gray-600 mx-auto" />
                                )}
                              </td>
                            );
                          })}
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenModal(user)}
                              className="min-h-[36px]"
                            >
                              <ShieldCheck className="h-4 w-4 mr-2" />
                              Gerenciar
                            </Button>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Modal de Controle */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Gerenciar Acesso</DialogTitle>
              <DialogDescription>
                <div className="mt-2">
                  <div className="font-semibold">{selectedUser?.full_name || selectedUser?.email}</div>
                  <div className="text-sm text-gray-500 mt-1">{selectedUser?.email}</div>
                </div>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Seleção de Produto */}
              <div>
                <Label>Produto / Aplicação</Label>
                <Select value={selectedProduct || ''} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o produto..." />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tipo de Ação */}
              <div>
                <Label>Tipo de Ação</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Button
                    type="button"
                    variant={actionType === 'trial' ? 'default' : 'outline'}
                    onClick={() => setActionType('trial')}
                    className="min-h-[44px]"
                  >
                    <CalendarDays className="h-4 w-4 mr-1" />
                    Trial
                  </Button>
                  <Button
                    type="button"
                    variant={actionType === 'lifetime' ? 'default' : 'outline'}
                    onClick={() => setActionType('lifetime')}
                    className="min-h-[44px]"
                  >
                    <Infinity className="h-4 w-4 mr-1" />
                    Vitalício
                  </Button>
                  <Button
                    type="button"
                    variant={actionType === 'revoke' ? 'default' : 'outline'}
                    onClick={() => setActionType('revoke')}
                    className="min-h-[44px] bg-red-600 hover:bg-red-700"
                  >
                    <Ban className="h-4 w-4 mr-1" />
                    Revogar
                  </Button>
                </div>
              </div>

              {/* Dias do Trial */}
              {actionType === 'trial' && (
                <div>
                  <Label>Duração (dias)</Label>
                  <Input
                    type="number"
                    value={trialDays}
                    onChange={(e) => setTrialDays(e.target.value)}
                    min="1"
                    max="365"
                    className="mt-2"
                  />
                </div>
              )}

              {/* Avisos */}
              {actionType === 'lifetime' && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md text-sm text-green-700 dark:text-green-300">
                  O usuário terá acesso permanente sem data de expiração.
                </div>
              )}
              {actionType === 'revoke' && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md text-sm text-red-700 dark:text-red-300">
                  Isso cancelará qualquer acesso ativo ao produto.
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleExecuteAction} 
                disabled={processingAction || !selectedProduct}
              >
                {processingAction && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AdminControleAcesso;
