import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Lock, Image, Plus, Trash2, Download, ExternalLink,
  Loader2, RefreshCw, ZoomIn, ChevronLeft, ChevronRight,
  HardDrive, Calendar, FileImage, AlertTriangle
} from 'lucide-react';
import { VAULT_COLORS, VAULT_ICONS } from './VaultCard';
import { formatFileSize } from '@/lib/googleApi';
import { Lock as LockIcon, Shield, Star, Heart, Folder, Archive, Database, Key } from 'lucide-react';

const IconComponents = {
  lock: LockIcon, shield: Shield, star: Star, heart: Heart,
  folder: Folder, archive: Archive, database: Database, key: Key,
};

const VaultViewer = ({
  vault,
  open,
  onClose,
  onLock,
  onAddPhotos,
  googleHook,
  onStatsUpdate,
}) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const colors = VAULT_COLORS[vault?.color] || VAULT_COLORS.blue;
  const VaultIcon = IconComponents[vault?.icon] || LockIcon;

  const loadFiles = useCallback(async () => {
    if (!vault?.drive_folder_id || !googleHook.isConnected) return;
    setLoading(true);
    try {
      const res = await googleHook.getFolderFiles(vault.drive_folder_id);
      const fetchedFiles = res.files || [];
      setFiles(fetchedFiles);
      const totalSize = fetchedFiles.reduce((sum, f) => sum + (parseInt(f.size) || 0), 0);
      onStatsUpdate?.(vault.id, fetchedFiles.length, totalSize);
    } catch (err) {
      console.error('Erro ao carregar arquivos:', err);
    } finally {
      setLoading(false);
    }
  }, [vault, googleHook]);

  useEffect(() => {
    if (open && vault?.drive_folder_id) {
      loadFiles();
    } else if (open) {
      setFiles([]);
    }
  }, [open, vault?.id]);

  const handleDelete = async (fileId) => {
    setDeletingId(fileId);
    try {
      await googleHook.removeFileFromVault(fileId);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      setConfirmDeleteId(null);
      const remaining = files.filter((f) => f.id !== fileId);
      const totalSize = remaining.reduce((sum, f) => sum + (parseInt(f.size) || 0), 0);
      onStatsUpdate?.(vault.id, remaining.length, totalSize);
    } catch (err) {
      console.error('Erro ao deletar:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const imageFiles = files.filter((f) => f.mimeType?.startsWith('image/'));

  if (!vault || !open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative ml-auto w-full max-w-3xl h-full bg-gray-950 border-l border-gray-800 flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`flex-shrink-0 p-5 border-b border-gray-800 bg-gradient-to-r ${colors.bg}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-black/30 ${colors.icon}`}>
                  <VaultIcon size={22} />
                </div>
                <div>
                  <h2 className="font-bold text-white text-lg">{vault.name}</h2>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Image size={11} /> {files.length} arquivo{files.length !== 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center gap-1">
                      <HardDrive size={11} />
                      {formatFileSize(files.reduce((s, f) => s + (parseInt(f.size) || 0), 0))}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={loadFiles}
                  className="p-2 rounded-lg bg-black/20 text-gray-400 hover:text-white transition-colors"
                >
                  <RefreshCw size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { onLock(vault.id); onClose(); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/20 text-gray-400 hover:text-white text-xs font-medium transition-colors"
                >
                  <Lock size={13} /> Bloquear
                </motion.button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-black/20 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Add photos button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAddPhotos}
              className="mt-4 w-full py-2.5 rounded-xl border border-dashed border-gray-600 hover:border-blue-500 text-gray-500 hover:text-blue-400 text-sm font-medium flex items-center justify-center gap-2 transition-all"
            >
              <Plus size={16} /> Adicionar fotos do Google Photos
            </motion.button>
          </div>

          {/* No drive folder warning */}
          {!vault.drive_folder_id && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <AlertTriangle size={40} className="text-amber-400 mb-3 opacity-70" />
              <p className="text-gray-400 font-medium">Este cofre não tem pasta no Drive</p>
              <p className="text-gray-600 text-sm mt-1">
                Recrie o cofre com a opção "Criar pasta no Google Drive" marcada.
              </p>
            </div>
          )}

          {/* Files */}
          {vault.drive_folder_id && (
            <div className="flex-1 overflow-y-auto p-5">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-600">
                  <Loader2 size={32} className="animate-spin" />
                  <span className="text-sm">Carregando arquivos...</span>
                </div>
              ) : files.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-600">
                  <FileImage size={48} className="opacity-30" />
                  <p className="text-sm font-medium">Cofre vazio</p>
                  <p className="text-xs text-gray-700 text-center">
                    Adicione fotos do Google Photos para armazená-las aqui.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAddPhotos}
                    className="mt-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold flex items-center gap-2"
                  >
                    <Plus size={16} /> Adicionar fotos
                  </motion.button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {files.map((file, idx) => (
                    <motion.div
                      key={file.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group relative rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-all bg-gray-900"
                    >
                      {/* Thumbnail */}
                      <div
                        className="aspect-square cursor-pointer"
                        onClick={() => setLightboxIdx(imageFiles.indexOf(file))}
                      >
                        {file.thumbnailLink ? (
                          <img
                            src={file.thumbnailLink.replace('=s220', '=s400')}
                            alt={file.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileImage size={28} className="text-gray-700" />
                          </div>
                        )}
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <div className="flex justify-end gap-1">
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded-lg bg-black/50 text-gray-300 hover:text-white transition-colors"
                            >
                              <ExternalLink size={13} />
                            </a>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(file.id); }}
                            className="p-1.5 rounded-lg bg-black/50 text-gray-300 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <div>
                          <p className="text-white text-xs font-medium truncate">{file.name}</p>
                          <p className="text-gray-400 text-xs">{formatFileSize(parseInt(file.size))}</p>
                        </div>
                      </div>

                      {/* Delete confirm */}
                      <AnimatePresence>
                        {confirmDeleteId === file.id && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-red-950/95 flex flex-col items-center justify-center gap-2 p-3"
                          >
                            <Trash2 size={20} className="text-red-400" />
                            <p className="text-xs text-white text-center">Deletar do Drive?</p>
                            <div className="flex gap-2 w-full">
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="flex-1 py-1.5 rounded-lg text-xs bg-gray-800 text-gray-400 hover:text-white"
                              >
                                Não
                              </button>
                              <button
                                onClick={() => handleDelete(file.id)}
                                disabled={deletingId === file.id}
                                className="flex-1 py-1.5 rounded-lg text-xs bg-red-600 text-white hover:bg-red-500 disabled:opacity-50"
                              >
                                {deletingId === file.id ? <Loader2 size={12} className="animate-spin mx-auto" /> : 'Sim'}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Lightbox */}
          <AnimatePresence>
            {lightboxIdx !== null && imageFiles[lightboxIdx] && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/95 z-10 flex flex-col"
                onClick={() => setLightboxIdx(null)}
              >
                <div className="flex items-center justify-between p-4 flex-shrink-0">
                  <p className="text-gray-400 text-sm truncate max-w-xs">
                    {imageFiles[lightboxIdx]?.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">
                      {lightboxIdx + 1} / {imageFiles.length}
                    </span>
                    <button
                      onClick={() => setLightboxIdx(null)}
                      className="p-2 rounded-lg text-gray-500 hover:text-white transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
                <div
                  className="flex-1 flex items-center justify-center relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  {lightboxIdx > 0 && (
                    <button
                      onClick={() => setLightboxIdx((i) => i - 1)}
                      className="absolute left-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
                    >
                      <ChevronLeft size={24} />
                    </button>
                  )}
                  {imageFiles[lightboxIdx]?.thumbnailLink && (
                    <img
                      src={imageFiles[lightboxIdx].thumbnailLink.replace('=s220', '=s1600')}
                      alt={imageFiles[lightboxIdx].name}
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                  )}
                  {lightboxIdx < imageFiles.length - 1 && (
                    <button
                      onClick={() => setLightboxIdx((i) => i + 1)}
                      className="absolute right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
                    >
                      <ChevronRight size={24} />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VaultViewer;
