/**
 * Configuração centralizada de assets do Supabase Storage
 * Mapeia URLs do Supabase para nomes simples para facilitar a manutenção
 */

import { supabase } from '@/lib/customSupabaseClient';

const BUCKET_NAME = 'assets-publicos';

// URLs diretas dos assets
export const ASSETS = {
  Capa: 'https://wwwwyuwighdehmvnolrl.supabase.co/storage/v1/object/public/assets-publicos/Capa.jpg',
  Logo: 'https://wwwwyuwighdehmvnolrl.supabase.co/storage/v1/object/public/assets-publicos/Logo.png',
};

/**
 * Função helper para obter a URL de um asset pelo nome usando o cliente Supabase
 * @param {string} assetName - Nome do asset (ex: 'Capa', 'Logo')
 * @returns {string} URL pública do asset
 */
export const getAssetUrlFromStorage = (assetName) => {
  try {
    const fileMap = {
      'Logo': 'Logo.png',
      'Capa': 'Capa.jpg'
    };

    const fileName = fileMap[assetName];
    if (!fileName) {
      console.warn(`Asset '${assetName}' não encontrado no mapa`);
      return ASSETS[assetName] || '';
    }

    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.error(`Erro ao obter URL do asset '${assetName}':`, error);
    return ASSETS[assetName] || '';
  }
};
