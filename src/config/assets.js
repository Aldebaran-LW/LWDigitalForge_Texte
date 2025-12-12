/**
 * Função para obter a URL de um asset armazenado na pasta public
 * @param {string} assetName - Nome do asset (sem extensão)
 * @returns {string} - URL do asset
 */
export const getAssetUrlFromStorage = (assetName) => {
  // Mapeamento de nomes de assets para seus arquivos na pasta public
  const assets = {
    'Logo': '/Logo.png',
    'Capa': '/Logo.png', // Usando Logo como fallback se Capa não existir
  };

  // Retorna a URL do asset ou uma URL padrão se não encontrado
  return assets[assetName] || `/Logo.png`;
};
