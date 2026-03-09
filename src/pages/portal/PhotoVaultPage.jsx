import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, Plus, Shield, Wifi, WifiOff, AlertCircle,
  Loader2, RefreshCw, GalleryHorizontal, HardDrive,
  Sparkles, ChevronRight, Info
} from 'lucide-react';

import { usePhotoVaults } from '@/hooks/usePhotoVaults';
import { useGoogleDrivePhotos } from '@/hooks/useGoogleDrivePhotos';
import { useToast } from '@/components/ui/use-toast';

import VaultCard from '@/components/photovault/VaultCard';
import CreateVaultModal from '@/components/photovault/CreateVaultModal';
import UnlockVaultModal from '@/components/photovault/UnlockVaultModal';
import PhotoBrowser from '@/components/photovault/PhotoBrowser';
import VaultViewer from '@/components/photovault/VaultViewer';
import VaultSettingsModal from '@/components/photovault/VaultSettingsModal';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const PhotoVaultPage = () => {
  const { toast } = useToast();
  const googleHook = useGoogleDrivePhotos();
  const {
    vaults, loading: vaultsLoading, error: vaultsError,
    createVault, verifyVaultPassword, updateVaultStats,
    changeVaultPassword, deleteVault, refetch,
  } = usePhotoVaults();

  // Modais
  const [createOpen, setCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [unlockTarget, setUnlockTarget] = useState(null);
  const [viewerVault, setViewerVault] = useState(null);
  const [photoBrowserVault, setPhotoBrowserVault] = useState(null);
  const [settingsVault, setSettingsVault] = useState(null);
  const [isSettingsLoading, setIsSettingsLoading] = useState(false);

  // Cofres desbloqueados (session-only)
  const [unlockedIds, setUnlockedIds] = useState(new Set());

  // ─── Google Connection ────────────────────────────────────────────────────

  const handleConnectGoogle = async () => {
    try {
      await googleHook.connectGoogle();
      toast({ title: 'Google conectado!', description: 'Google Photos e Drive estão disponíveis.' });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erro ao conectar',
        description: err.message || 'Verifique se o VITE_GOOGLE_CLIENT_ID está configurado.',
      });
    }
  };

  // ─── Vault Operations ─────────────────────────────────────────────────────

  const handleCreateVault = async (data) => {
    setIsCreating(true);
    try {
      let driveFolderId = null;

      if (data.createDriveFolder && googleHook.isConnected) {
        try {
          const folder = await googleHook.createFolder(`PhotoVault - ${data.name}`);
          driveFolderId = folder.id;
        } catch {
          toast({ variant: 'destructive', title: 'Aviso', description: 'Não foi possível criar a pasta no Drive. O cofre será criado sem ela.' });
        }
      }

      await createVault({ ...data, driveFolderId });
      setCreateOpen(false);
      toast({ title: 'Cofre criado!', description: `"${data.name}" está pronto para uso.` });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Erro', description: err.message });
    } finally {
      setIsCreating(false);
    }
  };

  const handleUnlock = useCallback(async (vault, password) => {
    const ok = await verifyVaultPassword(vault, password);
    if (ok) {
      setUnlockedIds((prev) => new Set([...prev, vault.id]));
      toast({ title: `${vault.name} desbloqueado`, description: 'Cofre aberto com sucesso.' });
    }
    return ok;
  }, [verifyVaultPassword, toast]);

  const handleLock = useCallback((vaultId) => {
    setUnlockedIds((prev) => {
      const next = new Set(prev);
      next.delete(vaultId);
      return next;
    });
    if (viewerVault?.id === vaultId) setViewerVault(null);
  }, [viewerVault]);

  const handleOpenVault = useCallback((vault) => {
    if (!unlockedIds.has(vault.id)) return;
    setViewerVault(vault);
  }, [unlockedIds]);

  const handleAddPhotos = useCallback(async (photos) => {
    if (!photoBrowserVault?.drive_folder_id) return;
    let saved = 0;
    let failed = 0;
    for (const photo of photos) {
      try {
        await googleHook.savePhotoToVault(photo, photoBrowserVault.drive_folder_id);
        saved++;
      } catch {
        failed++;
      }
    }
    toast({
      title: `${saved} foto${saved !== 1 ? 's' : ''} salva${saved !== 1 ? 's' : ''}`,
      description: failed > 0 ? `${failed} falhou(haram) no upload.` : `No cofre "${photoBrowserVault.name}".`,
      variant: failed > 0 ? 'destructive' : 'default',
    });
    // Atualizar viewer se estiver aberto
    if (viewerVault?.id === photoBrowserVault.id) {
      const updatedVault = vaults.find((v) => v.id === photoBrowserVault.id);
      if (updatedVault) setViewerVault(updatedVault);
    }
  }, [photoBrowserVault, googleHook, toast, viewerVault, vaults]);

  const handleChangePassword = async (vaultId, currentPassword, newPassword) => {
    setIsSettingsLoading(true);
    try {
      await changeVaultPassword(vaultId, currentPassword, newPassword);
      toast({ title: 'Senha alterada com sucesso!' });
    } finally {
      setIsSettingsLoading(false);
    }
  };

  const handleDeleteVault = async (vaultId, password) => {
    setIsSettingsLoading(true);
    try {
      const vault = vaults.find((v) => v.id === vaultId);
      await deleteVault(vaultId, password);
      handleLock(vaultId);
      setSettingsVault(null);
      toast({ title: `Cofre "${vault?.name}" deletado.` });
    } finally {
      setIsSettingsLoading(false);
    }
  };

  const totalPhotos = vaults.reduce((s, v) => s + (v.photo_count || 0), 0);
  const totalSize = vaults.reduce((s, v) => s + (v.total_size_bytes || 0), 0);

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return (
    <>
      <Helmet>
        <title>PhotoVault - Portal LWDigitalForge</title>
      </Helmet>

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600/30 to-purple-600/30 border border-blue-500/30">
                <Shield size={20} className="text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">PhotoVault</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Partições seguras para suas fotos — protegidas por senha e armazenadas no Google Drive.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Google connection status */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={googleHook.isConnected ? googleHook.disconnect : handleConnectGoogle}
              disabled={googleHook.connecting}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm border transition-all ${
                googleHook.isConnected
                  ? 'border-emerald-500/30 bg-emerald-900/20 text-emerald-400 hover:bg-red-900/20 hover:text-red-400 hover:border-red-500/30'
                  : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {googleHook.connecting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : googleHook.isConnected ? (
                <Wifi size={16} />
              ) : (
                <WifiOff size={16} />
              )}
              {googleHook.connecting ? 'Conectando...' : googleHook.isConnected ? 'Google conectado' : 'Conectar Google'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-900/30 transition-all"
            >
              <Plus size={16} />
              Novo Cofre
            </motion.button>
          </div>
        </div>

        {/* Config warning */}
        {!GOOGLE_CLIENT_ID && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-amber-900/20 border border-amber-700/30 flex items-start gap-3"
          >
            <Info size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-400 font-semibold text-sm">Configuração necessária</p>
              <p className="text-amber-600 text-xs mt-1">
                Adicione <code className="bg-amber-900/30 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code> no seu
                arquivo <code className="bg-amber-900/30 px-1 rounded">.env</code> para habilitar a integração com Google Photos e Drive.{' '}
                <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="underline">
                  Configurar no Google Cloud Console →
                </a>
              </p>
            </div>
          </motion.div>
        )}

        {/* Stats bar */}
        {vaults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-4"
          >
            {[
              { label: 'Cofres', value: vaults.length, icon: Shield, color: 'text-blue-400' },
              { label: 'Fotos salvas', value: totalPhotos.toLocaleString('pt-BR'), icon: GalleryHorizontal, color: 'text-purple-400' },
              { label: 'Armazenamento', value: formatSize(totalSize), icon: HardDrive, color: 'text-emerald-400' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-gray-800/30 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-700/30 dark:border-gray-700/50">
                <div className={`flex items-center gap-2 text-xs text-gray-500 mb-1`}>
                  <Icon size={12} className={color} /> {label}
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Error state */}
        {vaultsError && (
          <div className="p-4 rounded-xl bg-red-900/20 border border-red-700/30 flex items-center gap-3">
            <AlertCircle size={18} className="text-red-400" />
            <div className="flex-1">
              <p className="text-red-400 text-sm">{vaultsError}</p>
            </div>
            <button onClick={refetch} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
              <RefreshCw size={16} />
            </button>
          </div>
        )}

        {/* Loading */}
        {vaultsLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500">
            <Loader2 size={32} className="animate-spin" />
            <span className="text-sm">Carregando cofres...</span>
          </div>
        ) : vaults.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 flex items-center justify-center">
                <Lock size={40} className="text-blue-400" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center"
              >
                <Sparkles size={12} className="text-white" />
              </motion.div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Nenhum cofre criado ainda
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
              Crie partições de memória protegidas por senha. Cada cofre tem sua própria pasta no Google Drive.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {!googleHook.isConnected && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleConnectGoogle}
                  disabled={googleHook.connecting}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 font-medium transition-all"
                >
                  {googleHook.connecting ? <Loader2 size={18} className="animate-spin" /> : <Wifi size={18} />}
                  Conectar Google
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCreateOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-blue-900/30 transition-all"
              >
                <Plus size={18} /> Criar primeiro cofre
              </motion.button>
            </div>

            {/* Feature highlights */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
              {[
                { icon: Shield, title: 'Protegido por senha', desc: 'Cada cofre tem sua própria senha independente', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                { icon: GalleryHorizontal, title: 'Google Photos', desc: 'Navegue e selecione fotos do seu Google Photos', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
                { icon: HardDrive, title: 'Google Drive', desc: 'Fotos salvas em pastas privadas no seu Drive', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
              ].map(({ icon: Icon, title, desc, color }) => (
                <div key={title} className={`p-4 rounded-xl border ${color} text-left`}>
                  <Icon size={20} className="mb-2" />
                  <p className="font-semibold text-gray-200 text-sm mb-0.5">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Vaults grid */
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <AnimatePresence>
              {vaults.map((vault) => (
                <VaultCard
                  key={vault.id}
                  vault={vault}
                  isUnlocked={unlockedIds.has(vault.id)}
                  onUnlock={(v) => setUnlockTarget(v)}
                  onLock={handleLock}
                  onOpen={handleOpenVault}
                  onDelete={(v) => setSettingsVault(v)}
                  onSettings={(v) => setSettingsVault(v)}
                />
              ))}
            </AnimatePresence>

            {/* Add vault card */}
            <motion.button
              whileHover={{ scale: 1.02, borderColor: 'rgb(59, 130, 246)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCreateOpen(true)}
              className="rounded-2xl border-2 border-dashed border-gray-700/50 hover:border-blue-500/50 flex flex-col items-center justify-center gap-3 py-12 text-gray-600 hover:text-blue-400 transition-all group min-h-[200px]"
            >
              <div className="p-3 rounded-xl bg-gray-800/50 group-hover:bg-blue-600/20 transition-colors">
                <Plus size={24} />
              </div>
              <span className="text-sm font-medium">Novo Cofre</span>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Modais */}
      <CreateVaultModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onConfirm={handleCreateVault}
        isCreating={isCreating}
        googleConnected={googleHook.isConnected}
      />

      <UnlockVaultModal
        vault={unlockTarget}
        open={!!unlockTarget}
        onClose={() => setUnlockTarget(null)}
        onUnlock={handleUnlock}
      />

      {viewerVault && (
        <VaultViewer
          vault={vaults.find((v) => v.id === viewerVault.id) || viewerVault}
          open={!!viewerVault}
          onClose={() => setViewerVault(null)}
          onLock={handleLock}
          onAddPhotos={() => {
            setPhotoBrowserVault(vaults.find((v) => v.id === viewerVault.id) || viewerVault);
          }}
          googleHook={googleHook}
          onStatsUpdate={updateVaultStats}
        />
      )}

      <PhotoBrowser
        open={!!photoBrowserVault}
        onClose={() => setPhotoBrowserVault(null)}
        onSaveSelected={handleAddPhotos}
        googleHook={googleHook}
        vaultName={photoBrowserVault?.name || ''}
      />

      <VaultSettingsModal
        vault={settingsVault}
        open={!!settingsVault}
        onClose={() => setSettingsVault(null)}
        onChangePassword={handleChangePassword}
        onDeleteVault={handleDeleteVault}
        isLoading={isSettingsLoading}
      />
    </>
  );
};

export default PhotoVaultPage;
