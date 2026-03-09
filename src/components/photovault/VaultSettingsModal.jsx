import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Trash2, Eye, EyeOff, Loader2, Settings, AlertTriangle } from 'lucide-react';
import { VAULT_COLORS, VAULT_ICONS } from './VaultCard';
import { Lock as LockIcon, Shield, Star, Heart, Folder, Archive, Database } from 'lucide-react';

const IconComponents = {
  lock: LockIcon, shield: Shield, star: Star, heart: Heart,
  folder: Folder, archive: Archive, database: Database, key: Key,
};

const VaultSettingsModal = ({ vault, open, onClose, onChangePassword, onDeleteVault, isLoading }) => {
  const [tab, setTab] = useState('password');
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [deletePwd, setDeletePwd] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!vault || !open) return null;

  const colors = VAULT_COLORS[vault.color] || VAULT_COLORS.blue;

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (newPwd !== confirmPwd) { setError('Novas senhas não coincidem.'); return; }
    if (newPwd.length < 4) { setError('Nova senha deve ter ao menos 4 caracteres.'); return; }
    try {
      await onChangePassword(vault.id, currentPwd, newPwd);
      setSuccess('Senha alterada com sucesso!');
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
    } catch (err) {
      setError(err.message || 'Erro ao alterar senha.');
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onDeleteVault(vault.id, deletePwd);
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao deletar cofre.');
    }
  };

  const handleClose = () => {
    setCurrentPwd(''); setNewPwd(''); setConfirmPwd(''); setDeletePwd('');
    setError(''); setSuccess(''); setTab('password');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-sm bg-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`p-5 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r ${colors.bg}`}>
            <div className="flex items-center gap-2">
              <Settings size={18} className={colors.icon} />
              <span className="font-bold text-white">{vault.name}</span>
            </div>
            <button onClick={handleClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-black/30 transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => { setTab('password'); setError(''); setSuccess(''); }}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                tab === 'password' ? 'text-white border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Alterar Senha
            </button>
            <button
              onClick={() => { setTab('delete'); setError(''); setSuccess(''); }}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                tab === 'delete' ? 'text-red-400 border-b-2 border-red-500' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Deletar Cofre
            </button>
          </div>

          <div className="p-5">
            {tab === 'password' && (
              <form onSubmit={handleChangePassword} className="space-y-4">
                {[
                  { label: 'Senha atual', value: currentPwd, onChange: setCurrentPwd },
                  { label: 'Nova senha', value: newPwd, onChange: setNewPwd },
                  { label: 'Confirmar nova senha', value: confirmPwd, onChange: setConfirmPwd },
                ].map(({ label, value, onChange }) => (
                  <div key={label}>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
                    <div className="relative">
                      <input
                        type={showPasswords ? 'text' : 'password'}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2.5 pr-10 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
                      >
                        {showPasswords ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                ))}

                {error && <p className="text-red-400 text-xs flex items-center gap-1.5"><AlertTriangle size={12} />{error}</p>}
                {success && <p className="text-emerald-400 text-xs">{success}</p>}

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Key size={14} />}
                  Alterar Senha
                </motion.button>
              </form>
            )}

            {tab === 'delete' && (
              <form onSubmit={handleDelete} className="space-y-4">
                <div className="p-3 rounded-xl bg-red-900/20 border border-red-700/30 flex items-start gap-2">
                  <AlertTriangle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-400">
                    Esta ação é irreversível. O cofre e seus metadados serão deletados.
                    As fotos no Google Drive <strong>não</strong> serão excluídas.
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Digite sua senha para confirmar
                  </label>
                  <input
                    type="password"
                    value={deletePwd}
                    onChange={(e) => setDeletePwd(e.target.value)}
                    placeholder="Senha do cofre"
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                </div>

                {error && <p className="text-red-400 text-xs flex items-center gap-1.5"><AlertTriangle size={12} />{error}</p>}

                <motion.button
                  type="submit"
                  disabled={isLoading || !deletePwd}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  Deletar Cofre
                </motion.button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VaultSettingsModal;
