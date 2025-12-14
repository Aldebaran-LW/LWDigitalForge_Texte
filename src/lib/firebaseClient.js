import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Configuração do Firebase
// As credenciais devem estar nas variáveis de ambiente
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Inicializar Firebase apenas se as credenciais estiverem configuradas
let app = null;
let auth = null;
let googleProvider = null;

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    
    // Configurar escopos do Google OAuth
    googleProvider.addScope('profile');
    googleProvider.addScope('email');
    
    console.log('✅ Firebase inicializado com sucesso');
  } else {
    console.warn('⚠️ Firebase não configurado. Configure as variáveis de ambiente VITE_FIREBASE_*');
  }
} catch (error) {
  console.error('❌ Erro ao inicializar Firebase:', error);
}

export { app, auth, googleProvider };
export default app;
