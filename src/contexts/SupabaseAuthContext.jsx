
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);

  const fetchUserProfile = useCallback(async (user) => {
    if (!user) {
      setRole(null);
      setProfile(null);
      return null;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // Ignore error if no profile is found yet
        console.error('Error fetching user profile:', error);
        throw error;
      }
      
      const userRole = data?.role || 'USER';
      setRole(userRole);
      setProfile(data);
      return { ...data, role: userRole };

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro de Perfil",
        description: "Não foi possível carregar as informações do seu perfil.",
      });
      setRole('USER'); 
      setProfile(null);
      return null;
    }
  }, [toast]);

  const handleSession = useCallback(async (currentSession) => {
    setSession(currentSession);
    const currentUser = currentSession?.user ?? null;
    setUser(currentUser);
    if (currentUser) {
      await fetchUserProfile(currentUser);
    } else {
      setRole(null);
      setProfile(null);
    }
    setLoading(false);
  }, [fetchUserProfile]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        await handleSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession]);

  const signUp = useCallback(async (fullName, phone, email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
            full_name: fullName,
            phone: phone
        }
      }
    });
    
    setLoading(false);
    if (error) {
        toast({
            variant: "destructive",
            title: "Falha no Cadastro",
            description: error.message || "Algo deu errado. Tente novamente.",
        });
        return { error };
    }

    toast({
        title: "Cadastro Quase Concluído!",
        description: "Enviamos um link de confirmação para o seu e-mail. Por favor, verifique sua caixa de entrada.",
    });

    return { error: null };
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    setLoading(false);
    if (error) {
      if (error.message.includes('Email not confirmed')) {
          toast({
            variant: "destructive",
            title: "E-mail Não Confirmado",
            description: "Por favor, verifique seu e-mail para ativar sua conta antes de fazer o login.",
          });
      } else {
        toast({
          variant: "destructive",
          title: "Falha no Login",
          description: "Credenciais inválidas. Verifique seu e-mail e senha.",
        });
      }
      return { error };
    }

    if (data.user) {
      const userProfile = await fetchUserProfile(data.user);
      const userRole = userProfile?.role || 'USER';

      toast({
        title: `Bem-vindo${userProfile?.full_name ? `, ${userProfile.full_name}` : ''}!`,
        description: "Login realizado com sucesso! Redirecionando...",
      });
      
      if (userRole === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/portal/meus-produtos');
      }
    }
    
    return { error: null };
  }, [toast, navigate, fetchUserProfile]);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('Erro no signInWithOAuth:', error);
        toast({
          variant: "destructive",
          title: "Erro no Login",
          description: error.message || "Não foi possível fazer login com Google.",
        });
        setLoading(false);
        return { error };
      }

      // O loading será desativado quando a sessão for estabelecida
      return { error: null };
    } catch (error) {
      console.error('Erro no login com Google:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível conectar com o Google.",
      });
      setLoading(false);
      return { error };
    }
  }, [toast]);

  const signOut = useCallback(async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    setUser(null);
    setSession(null);
    setRole(null);
    setProfile(null);
    toast({ title: "Logout Realizado", description: "Você foi desconectado com sucesso." });
    navigate('/login');
  }, [toast, navigate]);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    role,
    profile,
    isAuthenticated: !!session,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  }), [user, session, loading, role, profile, signUp, signIn, signInWithGoogle, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
