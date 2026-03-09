import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Shield, Star, Heart, Folder, Archive, Database, Key, Eye, EyeOff, FolderPlus, Loader2 } from 'lucide-react';
import { VAULT_COLORS, VAULT_ICONS } from './VaultCard';

const COLORS = Object.keys(VAULT_COLORS);
const ICONS = Object.keys(VAULT_ICONS);

const COLOR_LABELS = {
  blue: 'Azul', purple: 'Roxo', emerald: 'Verde', rose: 'Rosa',
  amber: 'Âmbar', cyan: 'Ciano', violet: 'Violeta', orange: 'Laranja',
};
const COLOR_DOTS = {
  blue: 'bg-blue-500', purple: 'bg-purple-500', emerald: 'bg-emerald-500',
  rose: 'bg-rose-500', amber: 'bg-amber-500', cyan: 'bg-cyan-500',
  violet: 'bg-violet-500', orange: 'bg-orange-500',
};

const IconComponents = {
  lock: Lock, shield: Shield, star: Star, heart: Heart,
  folder: Folder, archive: Archive, database: Database, key: Key,
};

const CreateVaultModal = ({ open, onClose, onConfirm, isCreating, googleConnected }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [color, setColor] = useState('blue');
  const [icon, setIcon] = useState('lock');
  const [createDriveFolder, setCreateDriveFolder] = useState(true);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Nome é obrigatório';
    if (name.trim().length < 2) e.name = 'Mínimo 2 caracteres';
    if (!password) e.password = 'Senha é obrigatória';
    if (password.length < 4) e.password = 'Mínimo 4 caracteres';
    if (password !== confirmPassword) e.confirmPassword = 'Senhas não coincidem';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onConfirm({ name: name.trim(), description: description.trim(), password, color, icon, createDriveFolder });
  };

  const handleClose = () => {
    setName(''); setDescription(''); setPassword(''); setConfirmPassword('');
    setColor('blue'); setIcon('lock'); setErrors({}); setCreateDriveFolder(true);
    onClose();
  };

  const SelectedIcon = IconComponents[icon] || Lock;

  if (!open) return null;

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
          className="relative w-full max-w-md bg-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-5 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${VAULT_COLORS[color]?.bg || ''} border ${VAULT_COLORS[color]?.border || ''}`}>
                <SelectedIcon size={20} className={VAULT_COLORS[color]?.icon || 'text-blue-400'} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Novo Cofre</h2>
                <p className="text-xs text-gray-500">Partição protegida por senha</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Nome do Cofre
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: Fotos Pessoais, Família 2024..."
                className={`w-full px-4 py-2.5 rounded-xl bg-gray-800 border text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                  errors.name ? 'border-red-500/70' : 'border-gray-700'
                }`}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Descrição <span className="text-gray-600">(opcional)</span>
              </label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o conteúdo deste cofre..."
                className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>

            {/* Cor */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Cor</label>
              <div className="grid grid-cols-8 gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    title={COLOR_LABELS[c]}
                    className={`w-8 h-8 rounded-full ${COLOR_DOTS[c]} transition-all duration-200 ${
                      color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110' : 'hover:scale-110'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Ícone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Ícone</label>
              <div className="grid grid-cols-8 gap-2">
                {ICONS.map((ic) => {
                  const Ic = IconComponents[ic];
                  return (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIcon(ic)}
                      className={`p-2 rounded-xl transition-all duration-200 flex items-center justify-center ${
                        icon === ic
                          ? `bg-gradient-to-br ${VAULT_COLORS[color]?.bg} border ${VAULT_COLORS[color]?.border} ${VAULT_COLORS[color]?.icon}`
                          : 'bg-gray-800 border border-gray-700 text-gray-500 hover:text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <Ic size={16} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Senha do Cofre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  className={`w-full px-4 py-2.5 pr-10 rounded-xl bg-gray-800 border text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                    errors.password ? 'border-red-500/70' : 'border-gray-700'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirmar senha */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Confirmar Senha
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a senha"
                  className={`w-full px-4 py-2.5 pr-10 rounded-xl bg-gray-800 border text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                    errors.confirmPassword ? 'border-red-500/70' : 'border-gray-700'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Criar pasta no Drive */}
            {googleConnected && (
              <label className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700/50 cursor-pointer hover:bg-gray-800 transition-colors">
                <input
                  type="checkbox"
                  checked={createDriveFolder}
                  onChange={(e) => setCreateDriveFolder(e.target.checked)}
                  className="mt-0.5 accent-blue-500"
                />
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-300">
                    <FolderPlus size={14} className="text-blue-400" />
                    Criar pasta no Google Drive
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    As fotos salvas neste cofre serão armazenadas em uma pasta privada no seu Drive.
                  </p>
                </div>
              </label>
            )}

            {/* Aviso sem Drive */}
            {!googleConnected && (
              <div className="p-3 rounded-xl bg-amber-900/20 border border-amber-700/30 text-xs text-amber-400">
                Conecte sua conta Google para habilitar armazenamento no Drive.
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 transition-all font-medium"
              >
                Cancelar
              </button>
              <motion.button
                type="submit"
                disabled={isCreating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  VAULT_COLORS[color]?.icon || 'text-blue-400'
                } bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isCreating ? (
                  <><Loader2 size={16} className="animate-spin" /> Criando...</>
                ) : (
                  <><Lock size={16} /> Criar Cofre</>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateVaultModal;
