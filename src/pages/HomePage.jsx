import React from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from '@/components/HeroSection';
import ProductsSection from '@/components/ProductsSection';
import BenefitsSection from '@/components/BenefitsSection';

const HomePage = () => {
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