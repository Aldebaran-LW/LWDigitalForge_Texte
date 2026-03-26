/** Chave para permitir ver a home pública estando logado (ex.: “Voltar ao site”). */
export const LW_ALLOW_PUBLIC_HOME = 'lw_allow_public_home';

export function setAllowPublicHome() {
  try {
    sessionStorage.setItem(LW_ALLOW_PUBLIC_HOME, '1');
  } catch {
    /* ignore */
  }
}

export function isAllowPublicHome() {
  try {
    return sessionStorage.getItem(LW_ALLOW_PUBLIC_HOME) === '1';
  } catch {
    return false;
  }
}

export function clearAllowPublicHome() {
  try {
    sessionStorage.removeItem(LW_ALLOW_PUBLIC_HOME);
  } catch {
    /* ignore */
  }
}
