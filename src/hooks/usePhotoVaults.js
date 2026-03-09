import { useState, useEffect, useCallback } from 'react';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const BCRYPT_ROUNDS = 10;

export const usePhotoVaults = () => {
  const { user } = useAuth();
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVaults = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: dbError } = await supabase
        .from('photo_vaults')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      setVaults(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchVaults();
  }, [fetchVaults]);

  const createVault = useCallback(async ({ name, password, color, icon, description, driveFolderId }) => {
    if (!user) throw new Error('Usuário não autenticado');
    if (!name?.trim()) throw new Error('Nome do cofre é obrigatório');
    if (!password || password.length < 4) throw new Error('Senha deve ter ao menos 4 caracteres');

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const { data, error: dbError } = await supabase
      .from('photo_vaults')
      .insert({
        user_id: user.id,
        name: name.trim(),
        description: description?.trim() || '',
        password_hash: passwordHash,
        drive_folder_id: driveFolderId || null,
        color: color || 'blue',
        icon: icon || 'lock',
      })
      .select()
      .single();

    if (dbError) throw dbError;
    setVaults((prev) => [data, ...prev]);
    return data;
  }, [user]);

  const verifyVaultPassword = useCallback(async (vault, password) => {
    if (!vault?.password_hash || !password) return false;
    return bcrypt.compare(password, vault.password_hash);
  }, []);

  const updateVault = useCallback(async (vaultId, updates) => {
    const { data, error: dbError } = await supabase
      .from('photo_vaults')
      .update(updates)
      .eq('id', vaultId)
      .select()
      .single();

    if (dbError) throw dbError;
    setVaults((prev) => prev.map((v) => (v.id === vaultId ? data : v)));
    return data;
  }, []);

  const updateVaultStats = useCallback(async (vaultId, photoCount, totalSizeBytes) => {
    return updateVault(vaultId, {
      photo_count: photoCount,
      total_size_bytes: totalSizeBytes,
      last_accessed_at: new Date().toISOString(),
    });
  }, [updateVault]);

  const changeVaultPassword = useCallback(async (vaultId, currentPassword, newPassword) => {
    const vault = vaults.find((v) => v.id === vaultId);
    if (!vault) throw new Error('Cofre não encontrado');

    const valid = await bcrypt.compare(currentPassword, vault.password_hash);
    if (!valid) throw new Error('Senha atual incorreta');

    if (!newPassword || newPassword.length < 4) throw new Error('Nova senha deve ter ao menos 4 caracteres');

    const newHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    return updateVault(vaultId, { password_hash: newHash });
  }, [vaults, updateVault]);

  const deleteVault = useCallback(async (vaultId, password) => {
    const vault = vaults.find((v) => v.id === vaultId);
    if (!vault) throw new Error('Cofre não encontrado');

    const valid = await bcrypt.compare(password, vault.password_hash);
    if (!valid) throw new Error('Senha incorreta. Impossível deletar o cofre.');

    const { error: dbError } = await supabase
      .from('photo_vaults')
      .delete()
      .eq('id', vaultId);

    if (dbError) throw dbError;
    setVaults((prev) => prev.filter((v) => v.id !== vaultId));
  }, [vaults]);

  return {
    vaults,
    loading,
    error,
    createVault,
    verifyVaultPassword,
    updateVault,
    updateVaultStats,
    changeVaultPassword,
    deleteVault,
    refetch: fetchVaults,
  };
};
