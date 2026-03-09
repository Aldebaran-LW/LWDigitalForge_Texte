import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Unlock, Eye, EyeOff, Loader2, ShieldAlert } from 'lucide-react';
import { VAULT_COLORS, VAULT_ICONS } from './VaultCard';
import { Lock as LockIcon, Shield, Star, Heart, Folder, Archive, Database, Key } from 'lucide-react';

const IconComponents = {
  lock: LockIcon, shield: Shield, star: Star, heart: Heart,
  folder: Folder, archive: Archive, database: Database, key: Key,
};

const UnlockVaultModal = ({ vault, open, onClose, onUnlock }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setPassword('');
      setError('');
      setAttempts(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  if (!vault || !open) return null;

  const colors = VAULT_COLORS[vault.color] || VAULT_COLORS.blue;
  const VaultIcon = IconComponents[vault.icon] || LockIcon;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || loading) return;
    setLoading(true);
    setError('');

    try {
      const success = await onUnlock(vault, password);
      if (success) {
        setPassword('');
        onClose();
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setShaking(true);
        setTimeout(() => setShaking(false), 600);
        setError(
          newAttempts >= 3
            ? `Senha incorreta. ${newAttempts} tentativas. Verifique sua senha.`
            : 'Senha incorreta. Tente novamente.'
        );
        setPassword('');
        inputRef.current?.focus();
      }
    } catch {
      setError('Erro ao verificar senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={shaking
            ? { opacity: 1, scale: 1, x: [0, -12, 12, -8, 8, -4, 4, 0], y: 0 }
            : { opacity: 1, scale: 1, x: 0, y: 0 }
          }
          exit={{ opacity: 0, scale: 0.85, y: 30 }}
          transition={shaking ? { duration: 0.5 } : { type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glow effect */}
          <div className={`absolute inset-0 rounded-3xl blur-2xl opacity-20 bg-gradient-to-br ${colors.bg.replace('/20', '').replace('/40', '')}`} />

          <div className={`relative bg-gray-950 border ${colors.border} rounded-3xl overflow-hidden shadow-2xl`}>
            {/* Top glow bar */}
            <div className={`h-1 w-full bg-gradient-to-r ${colors.bg.replace('from-', 'from-').replace('to-', 'to-').replace('/20', '').replace('/40', '')}`} />

            <div className="p-8">
              {/* Vault icon with lock animation */}
              <div className="flex flex-col items-center mb-8">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <VaultIcon size={36} className={colors.icon} />
                </motion.div>
                <h2 className="text-2xl font-bold text-white text-center">{vault.name}</h2>
                {vault.description && (
                  <p className="text-gray-500 text-sm mt-1 text-center">{vault.description}</p>
                )}
                <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-600">
                  <Lock size={12} />
                  <span>Cofre protegido por senha</span>
                </div>
              </div>

              {/* Password form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 text-center">
                    Digite a senha para desbloquear
                  </label>
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      placeholder="••••••••"
                      className={`
                        w-full px-4 py-3.5 pr-12 rounded-xl text-center text-lg tracking-[0.3em]
                        bg-gray-900 border text-white placeholder-gray-700
                        focus:outline-none focus:ring-2 transition-all
                        ${error ? 'border-red-500/70 focus:ring-red-500/30' : `${colors.border} focus:ring-2`}
                        ${error ? '' : `focus:ring-${vault.color || 'blue'}-500/30`}
                      `}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="flex items-center gap-1.5 mt-2 text-red-400 text-xs justify-center"
                      >
                        <ShieldAlert size={13} /> {error}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading || !password}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full py-3.5 rounded-xl font-bold text-white
                    flex items-center justify-center gap-2
                    bg-gradient-to-r from-blue-600 to-purple-600
                    hover:from-blue-500 hover:to-purple-500
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all shadow-lg shadow-blue-900/30
                  `}
                >
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> Verificando...</>
                  ) : (
                    <><Unlock size={18} /> Desbloquear</>
                  )}
                </motion.button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 text-gray-600 hover:text-gray-400 text-sm transition-colors"
                >
                  Cancelar
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UnlockVaultModal;
