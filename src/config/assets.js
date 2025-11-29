/**
 * Configuração centralizada de assets do Supabase Storage
 * Mapeia URLs do Supabase para nomes simples para facilitar a manutenção
 */

export const ASSETS = {
  Capa: 'https://wwwwyuwighdehmvnolrl.supabase.co/storage/v1/object/public/assets-publicos/Capa.jpg',
  Logo: 'https://wwwwyuwighdehmvnolrl.supabase.co/storage/v1/object/public/assets-publicos/Logo.png',
};

/**
 * Função helper para obter a URL de um asset pelo nome
 * @param {string} assetName - Nome do asset (ex: 'Capa', 'Logo')
 * @returns {string} URL do asset ou string vazia se não encontrado
 */
export const getAssetUrl = (assetName) => {
  return ASSETS[assetName] || '';
};

export default ASSETS;

