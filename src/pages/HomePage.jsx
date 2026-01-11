import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import HeroSection from '@/components/HeroSection';
import ProductsSection from '@/components/ProductsSection';
import BenefitsSection from '@/components/BenefitsSection';

const HomePage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Se o user já está logado e não estamos a carregar a sessão
    if (!loading && user) {
      navigate('/portal/dashboard');
    }
  }, [user, loading, navigate]);

  // Se ainda estiver carregando, mostrar página normalmente
  // (evita flash de conteúdo antes do redirect)
  if (loading) {
    return null; // Ou um spinner se preferir
  }

  return (
    <>
      <Helmet>
        <title>LWDigitalForge - Automação Inteligente | Bots e Ferramentas</title>
        <meta name="description" content="Transforme sua produtividade com bots Telegram e planilhas Excel inteligentes. Automação que trabalha por você 24/7." />
      </Helmet>
      <HeroSection />
      <ProductsSection />
      <BenefitsSection />
    </>
  );
};

export default HomePage;