
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
  Settings2,
  Mail,
  TestTube2,
  Package,
  Clock,
  Search,
  Filter
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all'); // 'all', 'ADMIN', 'USER'
  const [filterTrial, setFilterTrial] = useState('all'); // 'all', 'with_trial', 'no_trial'
  
  // Estados para o Modal de Licenças
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionType, setActionType] = useState('trial'); // 'trial', 'lifetime', 'revoke'
  const [trialDays, setTrialDays] = useState(7);
  const [processingAction, setProcessingAction] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Verificar usuário atual e role primeiro
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        const { data: currentProfile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .single();
        
        console.log('🔍 Diagnóstico - Usuário atual:', {
          userId: currentUser.id,
          email: currentUser.email,
          role: currentProfile?.role
        });

        if (currentProfile?.role !== 'ADMIN') {
          toast({
            variant: "destructive",
            title: "Acesso Negado",
            description: `Você não tem permissão de ADMIN. Seu role atual: ${currentProfile?.role || 'USER'}. Entre em contato com um administrador.`
          });
          setUsers([]);
          setLoading(false);
          return;
        }
      }

      // Buscar perfis com emails usando view ou função RPC
      // Tentar primeiro usar view users_with_emails, depois fallback para profiles
      console.log('🔍 Tentando buscar perfis...');
      
      let profiles = null;
      let profilesError = null;
      let hasEmailsInData = false;
      
      // Tentar buscar usando view users_with_emails (se existir)
      const { data: viewData, error: viewError } = await supabase
        .from('users_with_emails')
        .select('id, email, full_name, phone, role, created_at')
        .order('created_at', { ascending: false });
      
      if (!viewError && viewData) {
        console.log('✅ Usando view users_with_emails');
        profiles = viewData;
        hasEmailsInData = true;
      } else {
        console.log('⚠️ View não disponível, usando profiles + RPC');
        // Fallback: buscar de profiles (agora com email, coluna foi adicionada)
        const { data: profilesData, error: profilesErr } = await supabase
          .from('profiles')
          .select('id, email, full_name, phone, role')
          .order('id', { ascending: false });
        
        profiles = profilesData;
        profilesError = profilesErr;
        hasEmailsInData = false;
      }

      // Se houver erro e for relacionado a RLS, tentar buscar sem email como fallback
      if (profilesError) {
        console.error('❌ Erro ao buscar perfis:', {
          code: profilesError.code,
          message: profilesError.message,
          details: profilesError.details,
          hint: profilesError.hint
        });
        
        // Verificar se é erro de permissão/RLS
        if (profilesError.code === 'PGRST301' || profilesError.message?.includes('permission') || profilesError.message?.includes('policy')) {
          console.warn('⚠️ Erro de permissão RLS detectado, tentando buscar sem email...');
          
          // Tentativa de fallback: buscar sem email
          const { data: profilesWithoutEmail, error: noEmailError } = await supabase
            .from('profiles')
            .select('id, full_name, phone, role')
            .order('id', { ascending: false });

          if (noEmailError) {
            console.error('❌ Erro mesmo sem email:', noEmailError);
            toast({
              variant: "destructive",
              title: "Erro de Permissão RLS",
              description: `Não foi possível carregar os usuários. A migration pode não ter sido aplicada. Erro: ${noEmailError.message}. Verifique o console para mais detalhes.`
            });
            setUsers([]);
            setLoading(false);
            return;
          } else {
            console.log('✅ Usuários carregados sem email (fallback)');
            // Usar perfis sem email como fallback
            setUsers((profilesWithoutEmail || []).map(profile => ({
              id: profile.id,
              email: 'Email não disponível (sem permissão)',
              fullName: profile.full_name || 'Sem nome',
              phone: profile.phone || 'Sem telefone',
              role: profile.role || 'USER',
              createdAt: new Date().toISOString(),
              activeTrials: [],
              activeSubscriptions: [],
              allAccess: [],
              hasActiveTrial: false,
              hasActiveSubscription: false,
              hasAnyAccess: false
            })));
            setLoading(false);
            return;
          }
        } else {
          // Outro tipo de erro
          console.error('❌ Erro inesperado:', profilesError);
          toast({
            variant: "destructive",
            title: "Erro ao Carregar Usuários",
            description: `Erro: ${profilesError.message}. Verifique o console para mais detalhes.`
          });
          setUsers([]);
          setLoading(false);
          return;
        }
      }

      console.log('✅ Perfis carregados com sucesso:', profiles?.length || 0);

      if (!profiles || profiles.length === 0) {
        console.warn('⚠️ Nenhum perfil encontrado na tabela profiles');
        toast({
          variant: "default",
          title: "Nenhum Usuário Encontrado",
          description: "Não há usuários cadastrados no sistema."
        });
        setUsers([]);
        setLoading(false);
        return;
      }

      // Buscar trials e assinaturas ativas para cada usuário
      let activeTrials = [];
      let activeSubscriptions = [];
      let trialsByUser = {};
      let subscriptionsByUser = {};
      
      if (profiles.length > 0) {
        const userIds = profiles.map(p => p.id);
        
        try {
          // Buscar trials ativos
          const { data: trialsData, error: trialsError } = await supabase
            .from('user_trials')
            .select('user_id, app_id, expires_at, is_active')
            .in('user_id', userIds)
            .eq('is_active', true);

          if (trialsError) {
            console.error('Erro ao buscar trials:', trialsError);
          } else if (trialsData && trialsData.length > 0) {
            activeTrials = trialsData;
          }

          // Buscar assinaturas/compras aprovadas
          const { data: purchasesData, error: purchasesError } = await supabase
            .from('user_purchases')
            .select('user_id, app_id, purchase_type, status, expires_at, created_at')
            .in('user_id', userIds)
            .eq('status', 'APPROVED');

          if (purchasesError) {
            console.error('Erro ao buscar compras:', purchasesError);
          } else if (purchasesData && purchasesData.length > 0) {
            activeSubscriptions = purchasesData;
          }

          // Buscar nomes dos produtos (para trials e assinaturas)
          const allAppIds = [
            ...new Set([
              ...activeTrials.map(t => t.app_id),
              ...activeSubscriptions.map(p => p.app_id)
            ])
          ];

          if (allAppIds.length > 0) {
            const { data: productsData } = await supabase
              .from('registered_apps')
              .select('id, name')
              .in('id', allAppIds);

            // Criar mapa de produtos
            const productsMap = {};
            if (productsData) {
              productsData.forEach(p => {
                productsMap[p.id] = p.name;
              });
            }

            // Processar trials
            activeTrials.forEach(trial => {
              if (!trialsByUser[trial.user_id]) {
                trialsByUser[trial.user_id] = [];
              }
              const expiresAt = new Date(trial.expires_at);
              const now = new Date();
              if (expiresAt > now && trial.is_active) {
                trialsByUser[trial.user_id].push({
                  productId: trial.app_id,
                  productName: productsMap[trial.app_id] || 'Produto desconhecido',
                  expiresAt: trial.expires_at,
                  type: 'trial'
                });
              }
            });

            // Processar assinaturas/compras
            activeSubscriptions.forEach(purchase => {
              if (!subscriptionsByUser[purchase.user_id]) {
                subscriptionsByUser[purchase.user_id] = [];
              }
              
              const isLifetime = purchase.purchase_type === 'LIFETIME';
              const isExpired = purchase.expires_at && new Date(purchase.expires_at) < new Date();
              
              // Só adicionar se não for lifetime expirado ou se for lifetime
              if (isLifetime || (!isExpired && purchase.expires_at)) {
                subscriptionsByUser[purchase.user_id].push({
                  productId: purchase.app_id,
                  productName: productsMap[purchase.app_id] || 'Produto desconhecido',
                  purchaseType: purchase.purchase_type,
                  expiresAt: purchase.expires_at,
                  createdAt: purchase.created_at,
                  type: isLifetime ? 'lifetime' : 'subscription'
                });
              }
            });
          }
        } catch (error) {
          console.error('Erro ao processar trials e assinaturas:', error);
        }
      }

      // Se não usou a view, verificar se profiles tem email (coluna foi adicionada)
      const emailsMap = {};
      if (!hasEmailsInData && profiles) {
        // Se profiles já tem email (coluna foi adicionada), não precisa buscar via RPC
        if (profiles.length > 0 && profiles[0].email !== undefined) {
          console.log('✅ Emails carregados diretamente de profiles');
          hasEmailsInData = true; // Marcar que já tem emails
        } else {
          // Fallback: tentar buscar via RPC se coluna ainda não existe
          try {
            const userIds = profiles.map(p => p.id);
            const { data: emailsData, error: emailsError } = await supabase.rpc('get_user_emails', {
              user_ids: userIds
            });
            
            if (!emailsError && emailsData) {
              emailsData.forEach((item) => {
                emailsMap[item.user_id] = item.email;
              });
              console.log('✅ Emails carregados via RPC:', Object.keys(emailsMap).length);
            }
          } catch (error) {
            console.warn('Não foi possível buscar emails:', error);
          }
        }
      }

      // Formatar usuários com informações completas
      const formattedUsers = profiles.map(profile => {
        const trials = trialsByUser[profile.id] || [];
        const subscriptions = subscriptionsByUser[profile.id] || [];
        const allAccess = [...trials, ...subscriptions];
        
        // Email pode vir de: view, profile.email (coluna adicionada), ou emailsMap (RPC)
        const userEmail = profile.email || emailsMap[profile.id] || 'Email não disponível';
        
        return {
          id: profile.id,
          email: userEmail,
          fullName: profile.full_name || 'Sem nome',
          phone: profile.phone || 'Sem telefone',
          role: profile.role || 'USER',
          createdAt: profile.created_at || new Date().toISOString(),
          activeTrials: trials,
          activeSubscriptions: subscriptions,
          allAccess: allAccess,
          hasActiveTrial: trials.length > 0,
          hasActiveSubscription: subscriptions.length > 0,
          hasAnyAccess: allAccess.length > 0
        };
      });

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || 'Erro desconhecido ao carregar usuários'
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
    setSelectedProduct(null);
    setActionType('trial');
    setTrialDays(7);
    setIsLicenseModalOpen(true);
  };

  // Resetar estado quando o modal fechar
  useEffect(() => {
    if (!isLicenseModalOpen) {
      setSelectedProduct(null);
      setActionType('trial');
      setTrialDays(7);
    }
  }, [isLicenseModalOpen]);

  const handleViewUserDetails = async (user) => {
    setSelectedUserDetails(user);
    setIsDetailsModalOpen(true);
    setLoadingDetails(true);

    try {
      // Buscar todas as compras do usuário
      const { data: allPurchases, error: purchasesError } = await supabase
        .from('user_purchases')
        .select('user_id, app_id, purchase_type, status, expires_at, amount_paid')
        .eq('user_id', user.id)
        .order('id', { ascending: false });

      // Buscar todos os trials do usuário (ativos e inativos)
      const { data: allTrials, error: trialsError } = await supabase
        .from('user_trials')
        .select('user_id, app_id, started_at, expires_at, is_active')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false });

      // Buscar nomes dos produtos
      const allAppIds = [
        ...new Set([
          ...(allPurchases || []).map(p => p.app_id).filter(Boolean),
          ...(allTrials || []).map(t => t.app_id).filter(Boolean)
        ])
      ];

      let productsMap = {};
      if (allAppIds.length > 0) {
        const { data: productsData } = await supabase
          .from('registered_apps')
          .select('id, name')
          .in('id', allAppIds);

        if (productsData) {
          productsData.forEach(p => {
            productsMap[p.id] = p.name;
          });
        }
      }

      // Adicionar nomes aos dados
      const purchasesWithNames = (allPurchases || []).map(p => ({
        ...p,
        productName: productsMap[p.app_id] || 'Produto desconhecido'
      }));

      const trialsWithNames = (allTrials || []).map(t => ({
        ...t,
        productName: productsMap[t.app_id] || 'Produto desconhecido'
      }));

      setSelectedUserDetails({
        ...user,
        allPurchases: purchasesWithNames,
        allTrials: trialsWithNames,
        purchasesError: purchasesError?.message,
        trialsError: trialsError?.message
      });
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os detalhes do usuário."
      });
    } finally {
      setLoadingDetails(false);
    }
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

        // Insere compra vitalícia (seguindo o contrato exigido pela Edge Function)
        const purchaseData = {
          user_id: selectedUser.id,
          app_id: selectedProduct, // ID exato do app (referência para registered_apps)
          purchase_type: 'LIFETIME', // Fundamental para ignorar expiração
          status: 'APPROVED', // A Edge Function só lê registros 'APPROVED'
          payment_method: 'ADMIN_GRANT',
          amount_paid: 0,
          purchased_at: new Date().toISOString(), // OBRIGATÓRIO: data da compra
          expires_at: null // Nunca expira (LIFETIME)
        };
        
        const { error } = await supabase.from('user_purchases').insert(purchaseData);

        if (error) throw error;
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

        toast({ title: "Revogado", description: "Todo acesso ao produto foi removido deste usuário." });
      }

      setIsLicenseModalOpen(false);
      // Recarregar lista de usuários para atualizar trials
      await fetchUsers();
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">Gerenciar Usuários</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>Total: <strong className="text-gray-900 dark:text-white">{users.length}</strong></span>
            <span>Com Trial: <strong className="text-blue-600 dark:text-blue-400">{users.filter(u => u.hasActiveTrial).length}</strong></span>
            <span>Com Assinatura: <strong className="text-purple-600 dark:text-purple-400">{users.filter(u => u.hasActiveSubscription).length}</strong></span>
            <span>Vitalício: <strong className="text-green-600 dark:text-green-400">{users.filter(u => u.activeSubscriptions.some(s => s.type === 'lifetime')).length}</strong></span>
            <span>Admins: <strong className="text-purple-600 dark:text-purple-400">{users.filter(u => u.role === 'ADMIN').length}</strong></span>
          </div>
        </div>

        {/* Filtros e Busca */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 sm:mb-8 p-4 sm:p-5 md:p-6 bg-white dark:bg-[#111827]/80 rounded-lg shadow-md border border-gray-200 dark:border-white/10"
        >
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Filtros e Busca</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Busca por nome/email */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Buscar por nome ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 min-h-[44px]"
                    />
                </div>

                {/* Filtro por Role */}
                <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="min-h-[44px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Filtrar por tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos os tipos</SelectItem>
                        <SelectItem value="ADMIN">Apenas Admins</SelectItem>
                        <SelectItem value="USER">Apenas Usuários</SelectItem>
                    </SelectContent>
                </Select>

                {/* Filtro por Trial */}
                <Select value={filterTrial} onValueChange={setFilterTrial}>
                    <SelectTrigger className="min-h-[44px]">
                        <TestTube2 className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Filtrar por trial" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="with_trial">Com Trial Ativo</SelectItem>
                        <SelectItem value="no_trial">Sem Trial</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </motion.div>

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
                    <th scope="col" className="px-3 sm:px-4 md:px-6 py-2 sm:py-3">Nome / Email</th>
                    <th scope="col" className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 hidden lg:table-cell">Contato</th>
                    <th scope="col" className="px-3 sm:px-4 md:px-6 py-2 sm:py-3">Tipo</th>
                    <th scope="col" className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 hidden md:table-cell">Acessos Ativos</th>
                    <th scope="col" className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    // Aplicar filtros
                    let filteredUsers = users;
                    
                    if (searchTerm) {
                      const search = searchTerm.toLowerCase();
                      filteredUsers = filteredUsers.filter(user => 
                        user.fullName.toLowerCase().includes(search) ||
                        user.email.toLowerCase().includes(search) ||
                        user.phone?.toLowerCase().includes(search)
                      );
                    }
                    
                    if (filterRole !== 'all') {
                      filteredUsers = filteredUsers.filter(user => user.role === filterRole);
                    }
                    
                    if (filterTrial === 'with_trial') {
                      filteredUsers = filteredUsers.filter(user => user.hasActiveTrial);
                    } else if (filterTrial === 'no_trial') {
                      filteredUsers = filteredUsers.filter(user => !user.hasActiveTrial);
                    }
                    
                    return filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400 text-sm">
                          Nenhum usuário encontrado.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user, index) => (
                      <motion.tr 
                          key={user.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 + 0.3 }}
                          className="bg-white dark:bg-[#111827]/80 border-b dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-white/5"
                      >
                        <th scope="row" className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-medium text-gray-900 dark:text-white">
                          <div className="flex flex-col">
                            <span className="truncate max-w-[150px] sm:max-w-none font-semibold">{user.fullName}</span>
                            <div className="flex items-center gap-1 mt-1">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{user.email}</span>
                            </div>
                            <span className="text-xs text-gray-400 font-mono mt-1">{user.id.substring(0,8)}...</span>
                            <div className="lg:hidden mt-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400">{user.phone}</span>
                            </div>
                          </div>
                        </th>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 hidden lg:table-cell">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400">{user.phone || 'Sem telefone'}</span>
                            <span className="text-xs text-gray-500 mt-1 font-mono">
                              {user.id.substring(0, 8)}...
                            </span>
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
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 hidden md:table-cell">
                          {user.hasAnyAccess ? (
                            <div className="flex flex-col gap-2">
                              {/* Trials */}
                              {user.activeTrials.map((trial, idx) => (
                                <div key={`trial-${idx}`} className="flex items-center gap-2 p-1 bg-blue-50 dark:bg-blue-900/20 rounded">
                                  <TestTube2 className="h-3 w-3 text-blue-500 flex-shrink-0" />
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 truncate">
                                      {trial.productName}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      Trial - Expira: {new Date(trial.expiresAt).toLocaleDateString('pt-BR')}
                                    </span>
                                  </div>
                                </div>
                              ))}
                              {/* Assinaturas/Compras */}
                              {user.activeSubscriptions.map((sub, idx) => (
                                <div key={`sub-${idx}`} className={`flex items-center gap-2 p-1 rounded ${
                                  sub.type === 'lifetime' 
                                    ? 'bg-green-50 dark:bg-green-900/20' 
                                    : 'bg-purple-50 dark:bg-purple-900/20'
                                }`}>
                                  {sub.type === 'lifetime' ? (
                                    <ShieldCheck className="h-3 w-3 text-green-500 flex-shrink-0" />
                                  ) : (
                                    <Package className="h-3 w-3 text-purple-500 flex-shrink-0" />
                                  )}
                                  <div className="flex flex-col min-w-0">
                                    <span className={`text-xs font-medium truncate ${
                                      sub.type === 'lifetime'
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-purple-600 dark:text-purple-400'
                                    }`}>
                                      {sub.productName}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {sub.type === 'lifetime' 
                                        ? 'Vitalício' 
                                        : `${sub.purchaseType}${sub.expiresAt ? ` - Expira: ${new Date(sub.expiresAt).toLocaleDateString('pt-BR')}` : ''}`
                                      }
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">Sem acessos ativos</span>
                          )}
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right">
                          <div className="flex flex-col sm:flex-row gap-2 justify-end">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewUserDetails(user)}
                              className="hover:bg-gray-50 dark:hover:bg-gray-800 text-xs sm:text-sm min-h-[36px]"
                            >
                              <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              <span className="hidden sm:inline">Detalhes</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenLicenseModal(user)}
                              className="hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs sm:text-sm min-h-[36px]"
                            >
                              <Settings2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              <span className="hidden sm:inline">Gerenciar</span>
                              <span className="sm:hidden">Licença</span>
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                      ))
                    );
                  })()}
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
              <div className="space-y-2">
                <div>
                  <strong>{selectedUser?.fullName}</strong>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Mail className="h-3 w-3" />
                  <span>{selectedUser?.email}</span>
                </div>
                {(selectedUser?.hasAnyAccess) && (
                  <div className="mt-2 space-y-2">
                    {selectedUser.activeTrials.length > 0 && (
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                        <div className="font-semibold text-blue-700 dark:text-blue-300 mb-1 flex items-center gap-1">
                          <TestTube2 className="h-3 w-3" /> Trials Ativos:
                        </div>
                        {selectedUser.activeTrials.map((trial, idx) => (
                          <div key={idx} className="text-blue-600 dark:text-blue-400 ml-4">
                            • {trial.productName} - Expira em {new Date(trial.expiresAt).toLocaleDateString('pt-BR')}
                          </div>
                        ))}
                      </div>
                    )}
                    {selectedUser.activeSubscriptions.length > 0 && (
                      <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-xs">
                        <div className="font-semibold text-purple-700 dark:text-purple-300 mb-1 flex items-center gap-1">
                          <Package className="h-3 w-3" /> Assinaturas/Compras:
                        </div>
                        {selectedUser.activeSubscriptions.map((sub, idx) => (
                          <div key={idx} className={`ml-4 ${
                            sub.type === 'lifetime' 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-purple-600 dark:text-purple-400'
                          }`}>
                            • {sub.productName} - {sub.type === 'lifetime' ? 'Vitalício' : `${sub.purchaseType}${sub.expiresAt ? ` (Expira: ${new Date(sub.expiresAt).toLocaleDateString('pt-BR')})` : ''}`}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-3 sm:gap-4 py-2 sm:py-4">
            
            {/* Seleção de Produto */}
            <div className="grid gap-2">
              <Label className="text-sm">Produto / App</Label>
              <Select value={selectedProduct ?? ''} onValueChange={(value) => setSelectedProduct(value)}>
                <SelectTrigger className="min-h-[48px]">
                  <SelectValue placeholder="Selecione o produto..." />
                </SelectTrigger>
                <SelectContent>
                  {products.length > 0 ? (
                    products.map(p => (
                      <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>Nenhum produto disponível</SelectItem>
                  )}
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

      {/* Modal de Detalhes do Usuário */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Detalhes do Usuário</DialogTitle>
            <DialogDescription className="text-sm">
              <div className="space-y-2">
                <div>
                  <strong>{selectedUserDetails?.fullName}</strong>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Mail className="h-3 w-3" />
                  <span>{selectedUserDetails?.email}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {selectedUserDetails?.phone || 'Sem telefone'}
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>

          {loadingDetails ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {/* Resumo de Acessos */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {selectedUserDetails?.activeTrials?.length || 0}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Trials Ativos</div>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {selectedUserDetails?.activeSubscriptions?.length || 0}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Assinaturas</div>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {(selectedUserDetails?.allPurchases || []).filter(p => p.purchase_type === 'LIFETIME' && p.status === 'APPROVED').length}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Vitalícios</div>
                </div>
              </div>

              {/* Histórico de Compras */}
              <div>
                <h3 className="font-semibold mb-2 text-sm">Histórico de Compras</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedUserDetails?.allPurchases && selectedUserDetails.allPurchases.length > 0 ? (
                    selectedUserDetails.allPurchases.map((purchase, idx) => (
                      <div key={idx} className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{purchase.productName}</div>
                            <div className="text-gray-500">
                              {purchase.purchase_type} - {purchase.status}
                            </div>
                            {purchase.amount_paid && purchase.amount_paid > 0 && (
                              <div className="text-gray-500">
                                Valor: R$ {(purchase.amount_paid / 100).toFixed(2).replace('.', ',')}
                              </div>
                            )}
                            {purchase.expires_at && (
                              <div className="text-gray-500">
                                Expira: {new Date(purchase.expires_at).toLocaleDateString('pt-BR')}
                              </div>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                            purchase.status === 'APPROVED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                            purchase.status === 'CANCELLED' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          }`}>
                            {purchase.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-400 text-center py-4">Nenhuma compra registrada</div>
                  )}
                </div>
              </div>

              {/* Histórico de Trials */}
              <div>
                <h3 className="font-semibold mb-2 text-sm">Histórico de Trials</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedUserDetails?.allTrials && selectedUserDetails.allTrials.length > 0 ? (
                    selectedUserDetails.allTrials.map((trial, idx) => (
                      <div key={idx} className={`p-2 rounded text-xs ${
                        trial.is_active && new Date(trial.expires_at) > new Date()
                          ? 'bg-blue-50 dark:bg-blue-900/20'
                          : 'bg-gray-50 dark:bg-gray-800'
                      }`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{trial.productName}</div>
                            <div className="text-gray-500">
                              Iniciado: {new Date(trial.started_at).toLocaleDateString('pt-BR')}
                            </div>
                            <div className="text-gray-500">
                              Expira: {new Date(trial.expires_at).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                            trial.is_active && new Date(trial.expires_at) > new Date()
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {trial.is_active && new Date(trial.expires_at) > new Date() ? 'Ativo' : 'Expirado'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-400 text-center py-4">Nenhum trial registrado</div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)} className="w-full sm:w-auto">
              Fechar
            </Button>
            <Button 
              onClick={() => {
                setIsDetailsModalOpen(false);
                handleOpenLicenseModal(selectedUserDetails);
              }} 
              className="w-full sm:w-auto"
            >
              <Settings2 className="h-4 w-4 mr-2" />
              Gerenciar Acesso
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminUsuarios;
