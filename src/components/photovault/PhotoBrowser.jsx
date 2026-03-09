import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Search, CheckSquare, Square, Image, Loader2,
  ChevronLeft, ChevronRight, Download, RefreshCw, Album, LayoutGrid
} from 'lucide-react';

const PhotoBrowser = ({ open, onClose, onSaveSelected, googleHook, vaultName }) => {
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [savingCount, setSavingCount] = useState(0);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [view, setView] = useState('photos'); // 'photos' | 'albums'
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);

  const loadPhotos = useCallback(async (pageToken = null, replace = false) => {
    try {
      replace ? setLoading(true) : setLoadingMore(true);
      const res = selectedAlbum
        ? await googleHook.fetchAlbumPhotos(selectedAlbum.id, pageToken)
        : await googleHook.fetchPhotos(pageToken, 50);

      const newPhotos = res.mediaItems || [];
      setPhotos((prev) => replace ? newPhotos : [...prev, ...newPhotos]);
      setNextPageToken(res.nextPageToken || null);
    } catch (err) {
      console.error('Erro ao carregar fotos:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [googleHook, selectedAlbum]);

  const loadAlbums = useCallback(async () => {
    try {
      setLoading(true);
      const res = await googleHook.fetchAlbums();
      setAlbums(res.albums || []);
    } catch (err) {
      console.error('Erro ao carregar álbuns:', err);
    } finally {
      setLoading(false);
    }
  }, [googleHook]);

  useEffect(() => {
    if (!open) return;
    setSelected(new Set());
    if (view === 'albums') {
      loadAlbums();
    } else {
      loadPhotos(null, true);
    }
  }, [open, view, selectedAlbum]);

  const toggleSelect = (photoId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(photoId) ? next.delete(photoId) : next.add(photoId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === photos.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(photos.map((p) => p.id)));
    }
  };

  const handleSave = async () => {
    const toSave = photos.filter((p) => selected.has(p.id));
    if (!toSave.length) return;
    setSavingCount(toSave.length);
    await onSaveSelected(toSave);
    setSavingCount(0);
    setSelected(new Set());
    onClose();
  };

  const filteredPhotos = photos.filter((p) => {
    if (!searchQuery) return true;
    return p.filename?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-4xl h-[85vh] bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              {selectedAlbum ? (
                <button
                  onClick={() => { setSelectedAlbum(null); setView('albums'); }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
              ) : null}
              <div>
                <h2 className="font-bold text-white">
                  {selectedAlbum ? selectedAlbum.title : 'Google Photos'}
                </h2>
                <p className="text-xs text-gray-500">
                  {selected.size > 0
                    ? `${selected.size} selecionada${selected.size !== 1 ? 's' : ''}`
                    : `Salvar no cofre: ${vaultName}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* View toggle */}
              {!selectedAlbum && (
                <div className="flex rounded-lg overflow-hidden border border-gray-800">
                  <button
                    onClick={() => setView('photos')}
                    className={`px-3 py-1.5 text-xs flex items-center gap-1.5 transition-colors ${
                      view === 'photos' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <LayoutGrid size={13} /> Fotos
                  </button>
                  <button
                    onClick={() => setView('albums')}
                    className={`px-3 py-1.5 text-xs flex items-center gap-1.5 transition-colors ${
                      view === 'albums' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <Album size={13} /> Álbuns
                  </button>
                </div>
              )}
              <button
                onClick={() => (view === 'albums' && !selectedAlbum) ? loadAlbums() : loadPhotos(null, true)}
                className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <RefreshCw size={16} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Search bar (only in photo view) */}
          {(view === 'photos' || selectedAlbum) && (
            <div className="px-4 py-3 border-b border-gray-800/50 flex-shrink-0">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nome de arquivo..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Select all bar */}
          {(view === 'photos' || selectedAlbum) && photos.length > 0 && (
            <div className="px-4 py-2 border-b border-gray-800/50 flex items-center justify-between flex-shrink-0">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
              >
                {selected.size === filteredPhotos.length && filteredPhotos.length > 0
                  ? <CheckSquare size={14} className="text-blue-400" />
                  : <Square size={14} />
                }
                Selecionar todas ({filteredPhotos.length})
              </button>
              {selected.size > 0 && (
                <span className="text-xs text-blue-400">{selected.size} marcada{selected.size !== 1 ? 's' : ''}</span>
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-600">
                <Loader2 size={32} className="animate-spin" />
                <span className="text-sm">Carregando...</span>
              </div>
            ) : view === 'albums' && !selectedAlbum ? (
              /* Albums grid */
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {albums.length === 0 ? (
                  <div className="col-span-full text-center py-16 text-gray-600">
                    <Album size={40} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Nenhum álbum encontrado</p>
                  </div>
                ) : albums.map((album) => (
                  <motion.button
                    key={album.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setSelectedAlbum(album); setView('photos'); }}
                    className="rounded-xl overflow-hidden border border-gray-800 hover:border-blue-600/50 transition-all text-left group"
                  >
                    <div className="aspect-square bg-gray-900 relative">
                      {album.coverPhotoBaseUrl ? (
                        <img
                          src={`${album.coverPhotoBaseUrl}=w300-h300-c`}
                          alt={album.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Album size={32} className="text-gray-700" />
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-semibold text-gray-300 truncate group-hover:text-white transition-colors">
                        {album.title}
                      </p>
                      <p className="text-xs text-gray-600">
                        {album.mediaItemsCount || 0} itens
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              /* Photos grid */
              <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1.5">
                {filteredPhotos.length === 0 ? (
                  <div className="col-span-full text-center py-16 text-gray-600">
                    <Image size={40} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Nenhuma foto encontrada</p>
                  </div>
                ) : filteredPhotos.map((photo) => {
                  const isSelected = selected.has(photo.id);
                  return (
                    <motion.div
                      key={photo.id}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => toggleSelect(photo.id)}
                      className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                        isSelected ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={`${photo.baseUrl}=w200-h200-c`}
                        alt={photo.filename}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="absolute inset-0 bg-blue-600/30 flex items-center justify-center"
                          >
                            <CheckSquare size={24} className="text-white drop-shadow-lg" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}

                {/* Load more */}
                {nextPageToken && (
                  <div className="col-span-full flex justify-center py-4">
                    <button
                      onClick={() => loadPhotos(nextPageToken)}
                      disabled={loadingMore}
                      className="px-6 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-400 hover:text-white hover:bg-gray-700 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {loadingMore ? <Loader2 size={14} className="animate-spin" /> : <ChevronRight size={14} />}
                      Carregar mais
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {selected.size > 0 && (
            <motion.div
              initial={{ y: 60 }}
              animate={{ y: 0 }}
              className="flex-shrink-0 border-t border-gray-800 p-4 bg-gray-950 flex items-center justify-between"
            >
              <span className="text-sm text-gray-400">
                {selected.size} foto{selected.size !== 1 ? 's' : ''} selecionada{selected.size !== 1 ? 's' : ''}
              </span>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                disabled={savingCount > 0}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-900/30"
              >
                {savingCount > 0 ? (
                  <><Loader2 size={16} className="animate-spin" /> Salvando {savingCount}...</>
                ) : (
                  <><Download size={16} /> Salvar no Cofre</>
                )}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PhotoBrowser;
