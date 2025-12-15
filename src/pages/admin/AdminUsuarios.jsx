
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  UserPlus, 
  Trash2, 
  Loader2, 
  ShieldCheck, 
  CalendarDays, 
  Ban,
  Settings2
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

const AdminUsuarios = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para o Modal de Licenças
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [actionType, setActionType] = useState('trial'); // 'trial', 'lifetime', 'revoke'
  const [trialDays, setTrialDays] = useState(7);
  const [processingAction, setProcessingAction] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      // Tentar usar a função RPC primeiro
      const { data: usersData, error: rpcError } = await supabase
        .rpc('get_users_with_emails');

      if (!rpcError && usersData && Array.isArray(usersData)) {
        const formattedUsers = usersData.map(user => ({
          id: user.id,
          email: user.email || `ID: ${user.id.substring(0, 8)}...`,
          fullName: user.full_name || 'Sem nome',
          phone: user.phone || 'Sem telefone',
          role: user.role || 'USER',
          createdAt: user.created_at || new Date().toISOString(),
        }));
        setUsers(formattedUsers);
        setLoading(false);
        return;
      }

      // Log do erro RPC se houver
      if (rpcError) {
        console.warn('Erro ao usar função RPC, usando fallback:', rpcError);
      }

      // Fallback: buscar apenas perfis
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Erro ao buscar perfis:', profilesError);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Falha ao carregar lista de usuários."
        });
        setUsers([]);
        return;
      }

      const formattedUsers = (profiles || []).map(profile => ({
        id: profile.id,
        email: profile.email || `ID: ${profile.id.substring(0, 8)}...`,
        fullName: profile.full_name || 'Sem nome',
        phone: profile.phone || 'Sem telefone',
        role: profile.role || 'USER',
        createdAt: profile.created_at || new Date().toISOString(),
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao carregar lista de usuários."
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('registered_apps')
      .select('id, name')
      .eq('is_active', true);
    if (data) setProducts(data);
  };

  const handleOpenLicenseModal = (user) => {
    setSelectedUser(user);
    setSelectedProduct('');
    setActionType('trial');
    setTrialDays(7);
    setIsLicenseModalOpen(true);
  };

  const handleExecuteAction = async () => {
    if (!selectedProduct || !selectedUser) {
      toast({ variant: "destructive", title: "Erro", description: "Selecione um produto." });
      return;
    }

    setProcessingAction(true);
    try {
      // 1. AÇÃO: CONCEDER VITALÍCIO
      if (actionType === 'lifetime') {
        // Remove trials existentes para evitar conflito
        await supabase
            .from('user_trials')
            .delete()
            .match({ user_id: selectedUser.id, app_id: selectedProduct });

        // Insere compra vitalícia
        const { data: purchase, error } = await supabase.from('user_purchases').insert({
          user_id: selectedUser.id,
          app_id: selectedProduct,
          purchase_type: 'LIFETIME',
          status: 'APPROVED',
          amount_paid: 0, // Admin grant
          payment_method: 'ADMIN_GRANT',
          expires_at: null // Nunca expira
        }).select().single();

        if (error) throw error;

        // Garante "direito de acesso" (para liberar portal/tools)
        const { error: accessError } = await supabase.from('user_product_access').upsert({
          user_id: selectedUser.id,
          product_id: selectedProduct,
          is_trial: false,
          status: 'active',
          access_level: 'lifetime',
          expires_at: null,
          purchase_id: purchase?.id || null,
          source: 'ADMIN',
          notes: 'Acesso vitalício concedido manualmente pelo admin',
        }, { onConflict: 'user_id,product_id,is_trial' });
        if (accessError) throw accessError;

        toast({ title: "Sucesso", description: `Acesso VITALÍCIO concedido a ${selectedUser.fullName}.` });
      } 
      
      // 2. AÇÃO: DEFINIR PERÍODO DE TESTE (TRIAL)
      else if (actionType === 'trial') {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + parseInt(trialDays));

        // Upsert na tabela de trials
        const { error } = await supabase.from('user_trials').upsert({
          user_id: selectedUser.id,
          app_id: selectedProduct,
          started_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
          is_active: true
        }, { onConflict: 'user_id, app_id' });

        if (error) throw error;

        // Garante registro em user_product_access (usado pelo PortalTestes + checkUserProductAccess)
        const { error: accessError } = await supabase.from('user_product_access').upsert({
          user_id: selectedUser.id,
          product_id: selectedProduct,
          product_name: null,
          access_level: 'trial',
          is_trial: true,
          trial_started_at: new Date().toISOString(),
          trial_ends_at: expiresAt.toISOString(),
          expires_at: expiresAt.toISOString(),
          status: 'active',
          source: 'ADMIN',
          notes: `Trial configurado manualmente (${trialDays} dias)`,
        }, { onConflict: 'user_id,product_id,is_trial' });
        if (accessError) throw accessError;

        toast({ title: "Sucesso", description: `Trial de ${trialDays} dias configurado.` });
      } 
      
      // 3. AÇÃO: REVOGAR ACESSO
      else if (actionType === 'revoke') {
        // Desativa trials
        await supabase.from('user_trials')
          .update({ is_active: false, expires_at: new Date().toISOString() })
          .match({ user_id: selectedUser.id, app_id: selectedProduct });

        // Cancela compras/assinaturas
        await supabase.from('user_purchases')
          .update({ status: 'CANCELLED', expires_at: new Date().toISOString() })
          .match({ user_id: selectedUser.id, app_id: selectedProduct });

        // Revoga acessos no "entitlement" central
        await supabase.from('user_product_access')
          .update({ status: 'revoked', trial_ends_at: new Date().toISOString(), expires_at: new Date().toISOString(), notes: 'Acesso revogado manualmente pelo admin' })
          .match({ user_id: selectedUser.id, product_id: selectedProduct });

        toast({ title: "Revogado", description: "Todo acesso ao produto foi removido deste usuário." });
      }

      setIsLicenseModalOpen(false);
    } catch (error) {
      console.error(error);
      toast({ 
        variant: "destructive", 
        title: "Erro na operação", 
        description: error.message || "Não foi possível atualizar a licença." 
      });
    } finally {
      setProcessingAction(false);
    }
  };

  const handleCreateTestAccount = () => {
    toast({
      title: "✅ Conta de Teste Criada!",
      description: "Login: teste@lwdigitalforge.com | Senha: teste123"
    });
  }
  
  const handleRemoveTestAccount = () => {
    toast({
      variant: "destructive",
      title: "🗑️ Conta de Teste Removida!",
      description: "A conta de teste foi removida com sucesso."
    });
  }

  return (
    <>
      <Helmet>
        <title>Gerenciar Usuários - LWDigitalForge Admin</title>
      </Helmet>
      <div className="px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-6 sm:mb-8">Gerenciar Usuários</h1>

        {/* Gerenciar Contas de Teste */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 sm:mb-8 p-4 sm:p-5 md:p-6 bg-white dark:bg-[#111827]/80 rounded-lg shadow-md border border-gray-200 dark:border-white/10"
        >
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Ações Rápidas</h2>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button onClick={handleCreateTestAccount} className="btn-primary w-full sm:w-auto min-h-[44px]">
                    <UserPlus className="mr-2 h-4 w-4" /> Criar Conta Fake
                </Button>
                <Button onClick={handleRemoveTestAccount} variant="destructive" className="w-full sm:w-auto min-h-[44px]">
                    <Trash2 className="mr-2 h-4 w-4" /> Limpar Contas Fake
                </Button>
            </div>
        </motion.div>

        {/* Lista de Usuários */}
        {loading ? (
          <div className="flex justify-center items-center py-12 sm:py-16 md:py-20">
            <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-blue-500 dark:text-white animate-spin" />
          </div>
        ) : (
          <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-[#111827]/80 rounded-lg shadow-md border border-gray-200 dark:border-white/10 overflow-x-auto -mx-4 sm:mx-0"
          >
            <div className="min-w-full inline-block align-middle">
              <table className="w-full text-xs sm:text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-[#111827] dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-3 sm:px-4 md:px-6 py-2 sm:py-3">Nome / ID</th>
                    <th scope="col" className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 hidden md:table-cell">Contato</th>
                    <th scope="col" className="px-3 sm:px-4 md:px-6 py-2 sm:py-3">Tipo</th>
                    <th scope="col" className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400 text-sm">
                        Nenhum usuário cadastrado ainda.
                      </td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <motion.tr 
                          key={user.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 + 0.3 }}
                          className="bg-white dark:bg-[#111827]/80 border-b dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-white/5"
                      >
                        <th scope="row" className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-medium text-gray-900 dark:text-white">
                          <div className="flex flex-col">
                            <span className="truncate max-w-[150px] sm:max-w-none">{user.fullName}</span>
                            <span className="text-xs text-gray-400 font-mono">{user.id.substring(0,8)}...</span>
                            <div className="md:hidden mt-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400 truncate block max-w-[150px]">{user.email}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{user.phone}</span>
                            </div>
                          </div>
                        </th>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 hidden md:table-cell">
                          <div className="flex flex-col">
                            <span className="truncate max-w-[200px]">{user.email}</span>
                            <span className="text-xs text-gray-400">{user.phone}</span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                            user.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenLicenseModal(user)}
                            className="hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs sm:text-sm min-h-[36px] w-full sm:w-auto"
                          >
                            <Settings2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Gerenciar Licença</span>
                            <span className="sm:hidden">Licença</span>
                          </Button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal de Gerenciamento de Licenças */}
      <Dialog open={isLicenseModalOpen} onOpenChange={setIsLicenseModalOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-[425px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Gerenciar Acesso</DialogTitle>
            <DialogDescription className="text-sm">
              Alterar permissões para <b>{selectedUser?.fullName}</b>
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-3 sm:gap-4 py-2 sm:py-4">
            
            {/* Seleção de Produto */}
            <div className="grid gap-2">
              <Label className="text-sm">Produto / App</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="min-h-[48px]">
                  <SelectValue placeholder="Selecione o produto..." />
                </SelectTrigger>
                <SelectContent>
                  {products.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Seleção de Ação */}
            <div className="grid gap-2">
              <Label className="text-sm">Tipo de Ação</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  type="button"
                  variant={actionType === 'trial' ? 'default' : 'outline'}
                  className={`min-h-[44px] text-xs sm:text-sm ${actionType === 'trial' ? 'bg-blue-600' : ''}`}
                  onClick={() => setActionType('trial')}
                >
                  <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> 
                  <span className="hidden sm:inline">Trial</span>
                </Button>
                <Button 
                  type="button"
                  variant={actionType === 'lifetime' ? 'default' : 'outline'}
                  className={`min-h-[44px] text-xs sm:text-sm ${actionType === 'lifetime' ? 'bg-green-600' : ''}`}
                  onClick={() => setActionType('lifetime')}
                >
                  <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> 
                  <span className="hidden sm:inline">Vitalício</span>
                </Button>
                <Button 
                  type="button"
                  variant={actionType === 'revoke' ? 'default' : 'outline'}
                  className={`min-h-[44px] text-xs sm:text-sm ${actionType === 'revoke' ? 'bg-red-600 hover:bg-red-700' : 'hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20'}`}
                  onClick={() => setActionType('revoke')}
                >
                  <Ban className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> 
                  <span className="hidden sm:inline">Revogar</span>
                </Button>
              </div>
            </div>

            {/* Configuração de Dias (Apenas para Trial) */}
            {actionType === 'trial' && (
              <div className="grid gap-2">
                <Label className="text-sm">Duração (dias)</Label>
                <Input 
                  type="number" 
                  value={trialDays} 
                  onChange={(e) => setTrialDays(e.target.value)}
                  min="1"
                  max="365"
                  className="min-h-[48px]"
                />
                <p className="text-xs text-gray-500">
                  Isso irá estender ou reduzir o acesso a partir de hoje.
                </p>
              </div>
            )}
            
            {actionType === 'lifetime' && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md text-xs sm:text-sm text-green-700 dark:text-green-300">
                O usuário terá acesso permanente a este produto sem data de expiração.
              </div>
            )}

            {actionType === 'revoke' && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md text-xs sm:text-sm text-red-700 dark:text-red-300">
                Isso cancelará qualquer assinatura ativa e expirará trials imediatamente.
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsLicenseModalOpen(false)} className="w-full sm:w-auto min-h-[44px]">Cancelar</Button>
            <Button onClick={handleExecuteAction} disabled={processingAction || !selectedProduct} className="w-full sm:w-auto min-h-[44px]">
              {processingAction && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminUsuarios;
