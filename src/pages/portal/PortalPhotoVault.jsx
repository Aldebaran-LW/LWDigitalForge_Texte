import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Cloud,
  ExternalLink,
  FolderOpen,
  HardDrive,
  Image as ImageIcon,
  Loader2,
  Lock,
  PlusCircle,
  RefreshCw,
  Shield,
  Unlock,
  UploadCloud,
  Video,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { hashVaultPassword, verifyVaultPassword } from '@/lib/photovaultCrypto';

const DEFAULT_FORM = {
  name: '',
  description: '',
  password: '',
  confirmPassword: '',
  color: '#2563eb',
};

const GOOGLE_RETURN_PATH = '/portal/photovault';

const formatBytes = (value) => {
  if (!value) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  let size = value;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

const formatDateTime = (value) => {
  if (!value) {
    return 'Agora mesmo';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
};

const getTransferStatusMeta = (status) => {
  if (status === 'FAILED') {
    return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300';
  }

  if (status === 'PARTIAL') {
    return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300';
  }

  return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300';
};

const buildThumbnailUrl = (item) => {
  if (item.thumbnailUrl) {
    return item.thumbnailUrl;
  }

  if (item.baseUrl) {
    return `${item.baseUrl}=w512-h512-c`;
  }

  return null;
};

const PortalPhotoVault = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [googleSession, setGoogleSession] = useState({ connected: false });
  const [googleLoading, setGoogleLoading] = useState(true);

  const [vaults, setVaults] = useState([]);
  const [vaultsLoading, setVaultsLoading] = useState(true);
  const [selectedVaultId, setSelectedVaultId] = useState(null);
  const [unlockedVaultId, setUnlockedVaultId] = useState(null);
  const [vaultPasswords, setVaultPasswords] = useState({});
  const [vaultForm, setVaultForm] = useState(DEFAULT_FORM);
  const [creatingVault, setCreatingVault] = useState(false);

  const [mediaItems, setMediaItems] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [mediaFilter, setMediaFilter] = useState('all');
  const [selectedMediaIds, setSelectedMediaIds] = useState([]);
  const [transferring, setTransferring] = useState(false);

  const [transferHistory, setTransferHistory] = useState([]);

  const selectedVault = useMemo(
    () => vaults.find((vault) => vault.id === selectedVaultId) || null,
    [vaults, selectedVaultId]
  );

  const filteredMediaItems = useMemo(() => {
    if (mediaFilter === 'photos') {
      return mediaItems.filter((item) => String(item.mimeType || '').startsWith('image/'));
    }

    if (mediaFilter === 'videos') {
      return mediaItems.filter((item) => String(item.mimeType || '').startsWith('video/'));
    }

    return mediaItems;
  }, [mediaFilter, mediaItems]);

  const selectedItems = useMemo(
    () => mediaItems.filter((item) => selectedMediaIds.includes(item.id)),
    [mediaItems, selectedMediaIds]
  );

  const totalTransferredCount = useMemo(
    () => transferHistory.reduce((sum, transfer) => sum + Number(transfer.transferred_items || 0), 0),
    [transferHistory]
  );

  const isSelectedVaultUnlocked = Boolean(selectedVault && unlockedVaultId === selectedVault.id);

  const apiRequest = useCallback(async (url, options = {}) => {
    const config = {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {}),
      },
    };

    const response = await fetch(url, config);
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.error || 'Nao foi possivel concluir a requisicao.');
    }

    return payload;
  }, []);

  const loadGoogleSession = useCallback(async () => {
    setGoogleLoading(true);

    try {
      const payload = await apiRequest('/api/google/session');
      setGoogleSession(payload);
    } catch (error) {
      setGoogleSession({ connected: false });
      toast({
        variant: 'destructive',
        title: 'Falha ao ler a sessao Google',
        description: error.message,
      });
    } finally {
      setGoogleLoading(false);
    }
  }, [apiRequest, toast]);

  const loadVaults = useCallback(async () => {
    if (!user) {
      return;
    }

    setVaultsLoading(true);

    try {
      const { data, error } = await supabase
        .from('photo_vaults')
        .select('*')
        .eq('is_archived', false)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const nextVaults = data || [];
      setVaults(nextVaults);
      setSelectedVaultId((currentSelected) => {
        if (!currentSelected && nextVaults.length > 0) {
          return nextVaults[0].id;
        }

        if (
          currentSelected &&
          nextVaults.length > 0 &&
          !nextVaults.some((vault) => vault.id === currentSelected)
        ) {
          setUnlockedVaultId(null);
          return nextVaults[0].id;
        }

        return currentSelected;
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar cofres',
        description: error.message,
      });
    } finally {
      setVaultsLoading(false);
    }
  }, [toast, user]);

  const loadTransferHistory = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('photo_vault_transfers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) {
        throw error;
      }

      setTransferHistory(data || []);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar historico',
        description: error.message,
      });
    }
  }, [toast, user]);

  const loadMedia = useCallback(async ({ pageToken = null, append = false } = {}) => {
    if (!googleSession.connected) {
      setMediaItems([]);
      setNextPageToken(null);
      return;
    }

    setMediaLoading(true);

    try {
      const params = new URLSearchParams({ pageSize: '24' });
      if (pageToken) {
        params.set('pageToken', pageToken);
      }

      const payload = await apiRequest(`/api/google/photos/list?${params.toString()}`);

      setMediaItems((current) => (append ? [...current, ...payload.items] : payload.items || []));
      setNextPageToken(payload.nextPageToken || null);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao listar Google Photos',
        description: error.message,
      });
    } finally {
      setMediaLoading(false);
    }
  }, [apiRequest, googleSession.connected, toast]);

  useEffect(() => {
    loadGoogleSession();
  }, [loadGoogleSession]);

  useEffect(() => {
    if (!user) {
      return;
    }

    loadVaults();
    loadTransferHistory();
  }, [loadTransferHistory, loadVaults, user]);

  useEffect(() => {
    if (googleSession.connected) {
      loadMedia();
      return;
    }

    setMediaItems([]);
    setNextPageToken(null);
    setSelectedMediaIds([]);
  }, [googleSession.connected, loadMedia]);

  useEffect(() => {
    const googleStatus = searchParams.get('google');
    const message = searchParams.get('message');

    if (!googleStatus) {
      return;
    }

    if (googleStatus === 'connected') {
      toast({
        title: 'Google conectado',
        description: 'Sua conta Google esta pronta para listar o Photos e salvar arquivos no Drive.',
      });
      loadGoogleSession();
    } else if (googleStatus === 'error') {
      toast({
        variant: 'destructive',
        title: 'Falha ao conectar Google',
        description: message || 'Revise o OAuth e tente novamente.',
      });
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('google');
    nextParams.delete('message');
    setSearchParams(nextParams, { replace: true });
  }, [loadGoogleSession, searchParams, setSearchParams, toast]);

  const handleConnectGoogle = () => {
    window.location.href = `/api/google/oauth/start?returnTo=${encodeURIComponent(GOOGLE_RETURN_PATH)}`;
  };

  const handleDisconnectGoogle = async () => {
    try {
      await apiRequest('/api/google/oauth/disconnect', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      setGoogleSession({ connected: false });
      setMediaItems([]);
      setNextPageToken(null);
      setSelectedMediaIds([]);

      toast({
        title: 'Google desconectado',
        description: 'A sessao do Google foi encerrada com sucesso.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Falha ao desconectar',
        description: error.message,
      });
    }
  };

  const handleCreateVault = async (event) => {
    event.preventDefault();

    if (!googleSession.connected) {
      toast({
        variant: 'destructive',
        title: 'Conecte o Google primeiro',
        description: 'O cofre precisa de uma pasta dedicada no Google Drive.',
      });
      return;
    }

    if (vaultForm.name.trim().length < 3) {
      toast({
        variant: 'destructive',
        title: 'Nome muito curto',
        description: 'Use pelo menos 3 caracteres para o nome do cofre.',
      });
      return;
    }

    if (vaultForm.password.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Senha fraca',
        description: 'Crie uma senha com ao menos 6 caracteres.',
      });
      return;
    }

    if (vaultForm.password !== vaultForm.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Senhas diferentes',
        description: 'A confirmacao precisa ser igual a senha do cofre.',
      });
      return;
    }

    setCreatingVault(true);

    try {
      const folderPayload = await apiRequest('/api/google/drive/create-folder', {
        method: 'POST',
        body: JSON.stringify({
          name: vaultForm.name.trim(),
        }),
      });

      const passwordHash = await hashVaultPassword(vaultForm.password);

      const { data, error } = await supabase
        .from('photo_vaults')
        .insert({
          user_id: user.id,
          name: vaultForm.name.trim(),
          description: vaultForm.description.trim() || null,
          color: vaultForm.color || '#2563eb',
          drive_folder_id: folderPayload.folder.id,
          drive_folder_name: folderPayload.folder.name,
          drive_folder_url: folderPayload.folder.webViewLink || null,
          password_hash: passwordHash,
        })
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      setVaultForm(DEFAULT_FORM);
      setVaults((current) => [data, ...current]);
      setSelectedVaultId(data.id);
      setUnlockedVaultId(data.id);
      setVaultPasswords((current) => ({ ...current, [data.id]: '' }));

      toast({
        title: 'Cofre criado',
        description: 'A nova particao protegida ja esta pronta para receber suas midias.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Nao foi possivel criar o cofre',
        description: error.message,
      });
    } finally {
      setCreatingVault(false);
    }
  };

  const handleUnlockVault = async (vault) => {
    const password = vaultPasswords[vault.id] || '';

    if (!password) {
      toast({
        variant: 'destructive',
        title: 'Informe a senha do cofre',
        description: 'A senha e necessaria para desbloquear a particao.',
      });
      return;
    }

    try {
      const isValid = await verifyVaultPassword(password, vault.password_hash);

      if (!isValid) {
        toast({
          variant: 'destructive',
          title: 'Senha incorreta',
          description: `A senha digitada nao desbloqueou o cofre "${vault.name}".`,
        });
        return;
      }

      setSelectedVaultId(vault.id);
      setUnlockedVaultId(vault.id);
      setVaultPasswords((current) => ({ ...current, [vault.id]: '' }));

      await supabase
        .from('photo_vaults')
        .update({ last_unlocked_at: new Date().toISOString() })
        .eq('id', vault.id);

      setVaults((current) =>
        current.map((item) =>
          item.id === vault.id
            ? { ...item, last_unlocked_at: new Date().toISOString() }
            : item
        )
      );

      toast({
        title: 'Cofre desbloqueado',
        description: `Agora voce pode enviar fotos para "${vault.name}".`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Falha ao desbloquear',
        description: error.message,
      });
    }
  };

  const handleToggleMedia = (mediaId) => {
    setSelectedMediaIds((current) =>
      current.includes(mediaId)
        ? current.filter((id) => id !== mediaId)
        : [...current, mediaId]
    );
  };

  const handleTransferSelected = async () => {
    if (!selectedVault) {
      toast({
        variant: 'destructive',
        title: 'Escolha um cofre',
        description: 'Selecione a particao de destino antes de transferir.',
      });
      return;
    }

    if (!isSelectedVaultUnlocked) {
      toast({
        variant: 'destructive',
        title: 'Cofre bloqueado',
        description: 'Desbloqueie o cofre de destino com a senha correta.',
      });
      return;
    }

    if (!selectedItems.length) {
      toast({
        variant: 'destructive',
        title: 'Nenhuma midia selecionada',
        description: 'Marque fotos ou videos antes de iniciar a transferencia.',
      });
      return;
    }

    setTransferring(true);

    try {
      const payload = await apiRequest('/api/google/photos/transfer', {
        method: 'POST',
        body: JSON.stringify({
          folderId: selectedVault.drive_folder_id,
          items: selectedItems,
        }),
      });

      const failedItems = payload.items.filter((item) => !item.success);
      const status = payload.summary.failed === 0
        ? 'COMPLETED'
        : payload.summary.transferred > 0
          ? 'PARTIAL'
          : 'FAILED';

      const { error } = await supabase.from('photo_vault_transfers').insert({
        user_id: user.id,
        vault_id: selectedVault.id,
        google_account_email: googleSession.profile?.email || null,
        source_label: 'google_photos',
        total_items: payload.summary.total,
        transferred_items: payload.summary.transferred,
        failed_items: payload.summary.failed,
        total_bytes: payload.summary.totalBytes,
        status,
        error_message: failedItems[0]?.error || null,
        items: payload.items,
      });

      if (error) {
        throw error;
      }

      setSelectedMediaIds(failedItems.map((item) => item.id).filter(Boolean));
      await loadTransferHistory();

      toast({
        title:
          status === 'COMPLETED'
            ? 'Transferencia concluida'
            : status === 'PARTIAL'
              ? 'Transferencia parcial'
              : 'Transferencia falhou',
        description:
          status === 'COMPLETED'
            ? `${payload.summary.transferred} arquivo(s) enviados para "${selectedVault.name}".`
            : `${payload.summary.transferred} sucesso(s) e ${payload.summary.failed} falha(s).`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Falha na transferencia',
        description: error.message,
      });
    } finally {
      setTransferring(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>PhotoVault - Google Photos + Drive</title>
      </Helmet>

      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-6 md:p-8 text-white shadow-2xl shadow-blue-950/20">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
                <Shield className="h-3.5 w-3.5" />
                PhotoVault
              </div>
              <h1 className="text-3xl font-bold md:text-4xl">
                Google Photos + Google Drive em um unico painel seguro
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-blue-100/80 md:text-base">
                Conecte sua conta Google, selecione fotos e videos do Google Photos e envie tudo
                para cofres separados no Drive. Cada cofre tem sua propria senha, sua propria pasta
                e um fluxo isolado de acesso.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[360px]">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-wide text-blue-100/70">Cofres</p>
                <p className="mt-2 text-2xl font-bold">{vaults.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-wide text-blue-100/70">Selecionados</p>
                <p className="mt-2 text-2xl font-bold">{selectedMediaIds.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-wide text-blue-100/70">Ja enviados</p>
                <p className="mt-2 text-2xl font-bold">{totalTransferredCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[360px,minmax(0,1fr)]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Conta Google
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    OAuth compativel com Vercel para Photos e Drive.
                  </p>
                </div>
                <Cloud className="h-5 w-5 text-blue-500" />
              </div>

              {googleLoading ? (
                <div className="flex items-center gap-2 rounded-2xl border border-dashed border-gray-200 px-4 py-6 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verificando sessao Google...
                </div>
              ) : googleSession.connected ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                    <div className="flex items-center gap-3">
                      {googleSession.profile?.picture ? (
                        <img
                          src={googleSession.profile.picture}
                          alt={googleSession.profile.name || 'Google profile'}
                          className="h-12 w-12 rounded-full border border-white/50 object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                          <Cloud className="h-5 w-5" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-emerald-800 dark:text-emerald-200">
                          {googleSession.profile?.name || 'Conta conectada'}
                        </p>
                        <p className="truncate text-sm text-emerald-700/80 dark:text-emerald-300/80">
                          {googleSession.profile?.email}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-emerald-700/80 dark:text-emerald-300/80">
                      Conectado em {formatDateTime(googleSession.profile?.connectedAt)}
                    </p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <Button onClick={() => loadMedia()} disabled={mediaLoading}>
                      {mediaLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="mr-2 h-4 w-4" />
                      )}
                      Atualizar biblioteca
                    </Button>
                    <Button variant="outline" onClick={handleDisconnectGoogle}>
                      Desconectar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <div>
                        <p className="font-medium">A conexao Google ainda nao foi iniciada.</p>
                        <p className="mt-1 text-amber-700/80 dark:text-amber-200/80">
                          Configure `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` e `SESSION_SECRET`
                          na Vercel antes de usar em producao.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleConnectGoogle} className="w-full">
                    <Cloud className="mr-2 h-4 w-4" />
                    Conectar com Google
                  </Button>
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Criar novo cofre
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Cada cofre gera uma pasta isolada dentro do seu Google Drive.
                  </p>
                </div>
                <HardDrive className="h-5 w-5 text-blue-500" />
              </div>

              <form className="space-y-3" onSubmit={handleCreateVault}>
                <Input
                  value={vaultForm.name}
                  onChange={(event) =>
                    setVaultForm((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Ex.: Fotos da familia"
                />
                <textarea
                  value={vaultForm.description}
                  onChange={(event) =>
                    setVaultForm((current) => ({ ...current, description: event.target.value }))
                  }
                  placeholder="Descreva quando usar esta particao"
                  className="min-h-[96px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-white"
                />

                <div className="grid gap-3 sm:grid-cols-[1fr,88px]">
                  <Input
                    type="password"
                    value={vaultForm.password}
                    onChange={(event) =>
                      setVaultForm((current) => ({ ...current, password: event.target.value }))
                    }
                    placeholder="Senha do cofre"
                  />
                  <Input
                    type="color"
                    value={vaultForm.color}
                    onChange={(event) =>
                      setVaultForm((current) => ({ ...current, color: event.target.value }))
                    }
                    className="h-10 p-1"
                  />
                </div>

                <Input
                  type="password"
                  value={vaultForm.confirmPassword}
                  onChange={(event) =>
                    setVaultForm((current) => ({
                      ...current,
                      confirmPassword: event.target.value,
                    }))
                  }
                  placeholder="Confirmar senha"
                />

                <Button type="submit" className="w-full" disabled={creatingVault || !user}>
                  {creatingVault ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <PlusCircle className="mr-2 h-4 w-4" />
                  )}
                  Criar particao segura
                </Button>
              </form>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Destino selecionado
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Envie as midias escolhidas apenas para o cofre desbloqueado.
                  </p>
                </div>
                <UploadCloud className="h-5 w-5 text-blue-500" />
              </div>

              {selectedVault ? (
                <div className="space-y-4">
                  <div
                    className="rounded-2xl border p-4"
                    style={{ borderColor: `${selectedVault.color || '#2563eb'}55` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedVault.name}
                        </p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {selectedVault.description || 'Cofre sem descricao adicional.'}
                        </p>
                      </div>
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: selectedVault.color || '#2563eb' }}
                      />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 dark:bg-gray-800">
                        {isSelectedVaultUnlocked ? 'Desbloqueado' : 'Bloqueado'}
                      </span>
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 dark:bg-gray-800">
                        {selectedItems.length} item(ns) pronto(s)
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleTransferSelected}
                    disabled={
                      transferring ||
                      !googleSession.connected ||
                      !selectedItems.length ||
                      !isSelectedVaultUnlocked
                    }
                    className="w-full"
                  >
                    {transferring ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="mr-2 h-4 w-4" />
                    )}
                    Transferir selecionados para o Drive
                  </Button>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Os arquivos sao copiados do Google Photos para a pasta dedicada do cofre no
                    Google Drive.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  Crie ou selecione um cofre para definir o destino das transferencias.
                </div>
              )}
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Seus cofres
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Cada particao exige a propria senha para liberar novas transferencias.
                  </p>
                </div>
                <Lock className="h-5 w-5 text-blue-500" />
              </div>

              {vaultsLoading ? (
                <div className="flex items-center gap-2 rounded-2xl border border-dashed border-gray-200 px-4 py-8 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Carregando cofres...
                </div>
              ) : vaults.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  Nenhum cofre criado ainda. Use o formulario ao lado para iniciar sua estrutura.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {vaults.map((vault) => {
                    const isUnlocked = unlockedVaultId === vault.id;
                    const isSelected = selectedVaultId === vault.id;

                    return (
                      <div
                        key={vault.id}
                        className={`rounded-2xl border p-4 transition-all ${
                          isSelected
                            ? 'border-blue-400 shadow-lg shadow-blue-500/10'
                            : 'border-gray-200 dark:border-gray-800'
                        }`}
                        style={{
                          background: `linear-gradient(180deg, ${vault.color || '#2563eb'}10 0%, transparent 45%)`,
                        }}
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => setSelectedVaultId(vault.id)}
                            className="min-w-0 text-left"
                          >
                            <p className="truncate font-semibold text-gray-900 dark:text-white">
                              {vault.name}
                            </p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              {vault.description || 'Cofre privado no Drive'}
                            </p>
                          </button>

                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: vault.color || '#2563eb' }}
                          />
                        </div>

                        <div className="mb-3 flex flex-wrap gap-2 text-xs">
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            {isUnlocked ? 'Desbloqueado' : 'Protegido por senha'}
                          </span>
                          {vault.last_unlocked_at && (
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                              Ultimo acesso: {formatDateTime(vault.last_unlocked_at)}
                            </span>
                          )}
                        </div>

                        {!isUnlocked ? (
                          <div className="space-y-2">
                            <Input
                              type="password"
                              value={vaultPasswords[vault.id] || ''}
                              onChange={(event) =>
                                setVaultPasswords((current) => ({
                                  ...current,
                                  [vault.id]: event.target.value,
                                }))
                              }
                              placeholder="Senha deste cofre"
                            />
                            <Button className="w-full" onClick={() => handleUnlockVault(vault)}>
                              <Unlock className="mr-2 h-4 w-4" />
                              Desbloquear particao
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => setUnlockedVaultId(null)}
                            >
                              <Lock className="mr-2 h-4 w-4" />
                              Bloquear novamente
                            </Button>
                            {vault.drive_folder_url && (
                              <Button
                                variant="ghost"
                                className="w-full"
                                onClick={() => window.open(vault.drive_folder_url, '_blank', 'noopener,noreferrer')}
                              >
                                <FolderOpen className="mr-2 h-4 w-4" />
                                Abrir pasta no Drive
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Biblioteca do Google Photos
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Selecione fotos e videos para copiar ao cofre ativo.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'all', label: 'Tudo' },
                    { key: 'photos', label: 'Fotos' },
                    { key: 'videos', label: 'Videos' },
                  ].map((filter) => (
                    <Button
                      key={filter.key}
                      variant={mediaFilter === filter.key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setMediaFilter(filter.key)}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>

              {!googleSession.connected ? (
                <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  Conecte sua conta Google para carregar a biblioteca do Photos.
                </div>
              ) : mediaLoading && mediaItems.length === 0 ? (
                <div className="flex items-center gap-2 rounded-2xl border border-dashed border-gray-200 px-4 py-10 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Buscando midias recentes...
                </div>
              ) : filteredMediaItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  Nenhuma midia encontrada para o filtro atual.
                </div>
              ) : (
                <>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredMediaItems.map((item) => {
                      const isSelected = selectedMediaIds.includes(item.id);
                      const isVideo = String(item.mimeType || '').startsWith('video/');

                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => handleToggleMedia(item.id)}
                          className={`group relative overflow-hidden rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'border-blue-500 ring-2 ring-blue-500/40'
                              : 'border-gray-200 hover:border-blue-300 dark:border-gray-800 dark:hover:border-blue-600'
                          }`}
                        >
                          <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                            {buildThumbnailUrl(item) ? (
                              <img
                                src={buildThumbnailUrl(item)}
                                alt={item.filename}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                {isVideo ? (
                                  <Video className="h-8 w-8 text-gray-400" />
                                ) : (
                                  <ImageIcon className="h-8 w-8 text-gray-400" />
                                )}
                              </div>
                            )}
                          </div>

                          <div className="absolute left-3 top-3 rounded-full bg-black/55 px-2 py-1 text-[11px] font-medium text-white backdrop-blur">
                            {isVideo ? 'Video' : 'Foto'}
                          </div>

                          {isSelected && (
                            <div className="absolute right-3 top-3 rounded-full bg-blue-600 p-1 text-white shadow-lg shadow-blue-500/25">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                          )}

                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 text-white">
                            <p className="truncate text-sm font-medium">{item.filename}</p>
                            <p className="mt-1 text-xs text-white/75">
                              {formatDateTime(item.mediaMetadata?.creationTime)}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedMediaIds.length} item(ns) selecionado(s) • destino:{' '}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedVault?.name || 'Nenhum cofre selecionado'}
                      </span>
                    </p>

                    {nextPageToken && (
                      <Button
                        variant="outline"
                        onClick={() => loadMedia({ pageToken: nextPageToken, append: true })}
                        disabled={mediaLoading}
                      >
                        {mediaLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="mr-2 h-4 w-4" />
                        )}
                        Carregar mais
                      </Button>
                    )}
                  </div>
                </>
              )}
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Historico recente
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Acompanhe as ultimas cargas entre o Photos e o Drive.
                  </p>
                </div>
                <ExternalLink className="h-5 w-5 text-blue-500" />
              </div>

              {transferHistory.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  Ainda nao houve transferencias registradas neste usuario.
                </div>
              ) : (
                <div className="space-y-3">
                  {transferHistory.map((transfer) => {
                    const vault = vaults.find((item) => item.id === transfer.vault_id);

                    return (
                      <div
                        key={transfer.id}
                        className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {vault?.name || 'Cofre removido'}
                              </p>
                              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getTransferStatusMeta(transfer.status)}`}>
                                {transfer.status === 'COMPLETED'
                                  ? 'Completa'
                                  : transfer.status === 'PARTIAL'
                                    ? 'Parcial'
                                    : 'Falhou'}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              {transfer.transferred_items} enviados de {transfer.total_items} •{' '}
                              {formatBytes(Number(transfer.total_bytes || 0))}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              {formatDateTime(transfer.created_at)}
                              {transfer.google_account_email
                                ? ` • ${transfer.google_account_email}`
                                : ''}
                            </p>
                          </div>

                          {vault?.drive_folder_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(vault.drive_folder_url, '_blank', 'noopener,noreferrer')}
                            >
                              <FolderOpen className="mr-2 h-4 w-4" />
                              Abrir pasta
                            </Button>
                          )}
                        </div>

                        {transfer.error_message && (
                          <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
                            {transfer.error_message}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default PortalPhotoVault;
