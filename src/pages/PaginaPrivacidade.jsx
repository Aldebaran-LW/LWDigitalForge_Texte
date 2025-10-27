import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const PaginaPrivacidade = () => {
  return (
    <>
      <Helmet>
        <title>Política de Privacidade - LWDigitalForge</title>
        <meta name="description" content="Entenda como coletamos, usamos e protegemos suas informações pessoais." />
      </Helmet>
      <div className="py-28 px-4 bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Política de Privacidade
            </h1>
            <p className="text-lg text-gray-600 dark:text-[#F9FAFB]/80">
              Última atualização: 27 de Setembro de 2025
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="prose dark:prose-invert max-w-none bg-white dark:bg-[#111827]/50 p-8 rounded-xl border border-gray-200 dark:border-[#3B82F6]/20"
          >
            <h2>1. Informações que Coletamos</h2>
            <p>
              Coletamos informações para fornecer serviços melhores a todos os nossos usuários. Coletamos informações de duas maneiras: informações que você nos fornece (por exemplo, ao criar uma conta) e informações que obtemos do seu uso de nossos serviços (por exemplo, dados de uso do produto).
            </p>
            
            <h2>2. Como Usamos as Informações</h2>
            <p>
              Usamos as informações que coletamos de todos os nossos serviços para fornecer, manter, proteger e melhorar esses serviços, para desenvolver novos e para proteger a LWDigitalForge e nossos usuários. Também usamos essas informações para oferecer a você conteúdo personalizado.
            </p>

            <h2>3. Segurança da Informação</h2>
            <p>
              Trabalhamos duro para proteger a LWDigitalForge e nossos usuários de acesso não autorizado ou alteração, divulgação ou destruição não autorizada das informações que mantemos.
            </p>
            
            <p>[Conteúdo placeholder - este não é um documento legal real.]</p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PaginaPrivacidade;