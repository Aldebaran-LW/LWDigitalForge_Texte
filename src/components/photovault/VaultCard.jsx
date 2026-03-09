import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, Unlock, Shield, Star, Heart, Folder, Archive,
  Database, Key, Image, Trash2, Settings, MoreVertical,
  Clock, HardDrive
} from 'lucide-react';
import { formatFileSize } from '@/lib/googleApi';

const VAULT_ICONS = {
  lock: Lock, shield: Shield, star: Star, heart: Heart,
  folder: Folder, archive: Archive, database: Database, key: Key,
};

const VAULT_COLORS = {
  blue:    { bg: 'from-blue-600/20 to-blue-900/40',   border: 'border-blue-500/30', glow: 'shadow-blue-500/20',   icon: 'text-blue-400',   badge: 'bg-blue-500/20 text-blue-300',   ring: 'ring-blue-500/50'   },
  purple:  { bg: 'from-purple-600/20 to-purple-900/40', border: 'border-purple-500/30', glow: 'shadow-purple-500/20', icon: 'text-purple-400', badge: 'bg-purple-500/20 text-purple-300', ring: 'ring-purple-500/50' },
  emerald: { bg: 'from-emerald-600/20 to-emerald-900/40', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20', icon: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300', ring: 'ring-emerald-500/50' },
  rose:    { bg: 'from-rose-600/20 to-rose-900/40',   border: 'border-rose-500/30',   glow: 'shadow-rose-500/20',   icon: 'text-rose-400',   badge: 'bg-rose-500/20 text-rose-300',   ring: 'ring-rose-500/50'   },
  amber:   { bg: 'from-amber-600/20 to-amber-900/40', border: 'border-amber-500/30', glow: 'shadow-amber-500/20', icon: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300', ring: 'ring-amber-500/50' },
  cyan:    { bg: 'from-cyan-600/20 to-cyan-900/40',   border: 'border-cyan-500/30',   glow: 'shadow-cyan-500/20',   icon: 'text-cyan-400',   badge: 'bg-cyan-500/20 text-cyan-300',   ring: 'ring-cyan-500/50'   },
  violet:  { bg: 'from-violet-600/20 to-violet-900/40', border: 'border-violet-500/30', glow: 'shadow-violet-500/20', icon: 'text-violet-400', badge: 'bg-violet-500/20 text-violet-300', ring: 'ring-violet-500/50' },
  orange:  { bg: 'from-orange-600/20 to-orange-900/40', border: 'border-orange-500/30', glow: 'shadow-orange-500/20', icon: 'text-orange-400', badge: 'bg-orange-500/20 text-orange-300', ring: 'ring-orange-500/50' },
};

const VaultCard = ({ vault, isUnlocked, onUnlock, onLock, onOpen, onDelete, onSettings }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const colors = VAULT_COLORS[vault.color] || VAULT_COLORS.blue;
  const VaultIcon = VAULT_ICONS[vault.icon] || Lock;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`
        relative rounded-2xl border bg-gradient-to-br backdrop-blur-sm
        ${colors.bg} ${colors.border}
        shadow-xl ${isUnlocked ? colors.glow : 'shadow-black/30'}
        ${isUnlocked ? `ring-2 ${colors.ring}` : ''}
        overflow-hidden cursor-pointer group
        transition-shadow duration-300
      `}
      onClick={() => isUnlocked ? onOpen(vault) : onUnlock(vault)}
    >
      {/* Shimmer effect quando desbloqueado */}
      {isUnlocked && (
        <motion.div
          animate={{ x: ['−100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
        />
      )}

      {/* Menu de contexto */}
      <div
        className="absolute top-3 right-3 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreVertical size={16} />
        </motion.button>
        <AnimatePresence>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -5 }}
                className="absolute right-0 top-8 z-20 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden"
              >
                {isUnlocked && (
                  <button
                    onClick={() => { onLock(vault.id); setMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <Lock size={14} /> Bloquear cofre
                  </button>
                )}
                <button
                  onClick={() => { onSettings(vault); setMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <Settings size={14} /> Configurações
                </button>
                <div className="border-t border-gray-700/50" />
                <button
                  onClick={() => { onDelete(vault); setMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors"
                >
                  <Trash2 size={14} /> Deletar cofre
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`p-3 rounded-xl bg-black/30 ${colors.icon}`}>
            <motion.div
              animate={isUnlocked ? { rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <VaultIcon size={24} />
            </motion.div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white truncate text-lg leading-tight">
              {vault.name}
            </h3>
            {vault.description && (
              <p className="text-xs text-gray-400 mt-0.5 truncate">{vault.description}</p>
            )}
          </div>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-2 mb-4">
          <motion.div
            animate={isUnlocked ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isUnlocked
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-gray-800/50 text-gray-500 border border-gray-700/50'
            }`}
          >
            {isUnlocked ? (
              <><Unlock size={11} /> Aberto</>
            ) : (
              <><Lock size={11} /> Bloqueado</>
            )}
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Image size={12} />
            <span>{vault.photo_count || 0} fotos</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <HardDrive size={12} />
            <span>{formatFileSize(vault.total_size_bytes)}</span>
          </div>
          {vault.last_accessed_at && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 col-span-2">
              <Clock size={12} />
              <span>Acessado {formatDate(vault.last_accessed_at)}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            w-full py-2.5 rounded-xl text-center text-sm font-semibold
            transition-all duration-200
            ${isUnlocked
              ? `bg-gradient-to-r ${colors.bg.replace('/20', '/40').replace('/40', '/60')} border ${colors.border} ${colors.icon} hover:brightness-125`
              : 'bg-gray-800/80 border border-gray-700/50 text-gray-400 hover:bg-gray-700/80 hover:text-white'
            }
          `}
        >
          {isUnlocked ? 'Abrir cofre →' : 'Desbloquear'}
        </motion.div>
      </div>
    </motion.div>
  );
};

export { VAULT_COLORS, VAULT_ICONS };
export default VaultCard;
