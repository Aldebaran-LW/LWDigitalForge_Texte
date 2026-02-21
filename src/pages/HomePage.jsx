import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import HeroSection from '@/components/HeroSection';
import ProductsSection from '@/components/ProductsSection';
import BenefitsSection from '@/components/BenefitsSection';
import UseCasesSection from '@/components/UseCasesSection';
import PortfolioSection from '@/components/PortfolioSection';
import PersuasiveCTA from '@/components/PersuasiveCTA';

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
        <title>LWDigitalForge - Aplicações Web e Sites para Empresas | Desenvolvimento Personalizado</title>
        <meta 
          name="description" 
          content="Desenvolvemos aplicações web modernas, sites institucionais e sistemas personalizados para empresas. Soluções sob medida que transformam processos e impulsionam resultados." 
        />
        <meta 
          name="keywords" 
          content="aplicações web, sites para empresas, desenvolvimento web, sistemas personalizados, e-commerce, sites institucionais, bots telegram, desenvolvimento sob medida" 
        />
      </Helmet>
      
      {/* Hero Section - Primeira impressão impactante */}
      <HeroSection />
      
      {/* Products Section - Mostrar produtos principais */}
      <ProductsSection />
      
      {/* Portfolio Section - Mostrar projetos realizados */}
      <PortfolioSection />
      
      {/* Benefits Section - Por que escolher */}
      <BenefitsSection />
      
      {/* Use Cases Section - Casos de uso reais */}
      <UseCasesSection />
      
      {/* Persuasive CTA - Call to action final */}
      <PersuasiveCTA />
    </>
  );
};

export default HomePage;