import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const PaginaTermos = () => {
  return (
    <>
      <Helmet>
        <title>Termos de Serviço - LWDigitalForge</title>
        <meta name="description" content="Leia nossos Termos de Serviço para entender as regras de uso de nossos produtos e plataforma." />
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
              Termos de Serviço
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
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar os serviços da LWDigitalForge, você aceita e concorda em estar vinculado aos termos e disposições deste acordo. Além disso, ao usar estes serviços específicos, você estará sujeito a quaisquer diretrizes ou regras publicadas aplicáveis a tais serviços.
            </p>
            
            <h2>2. Descrição do Serviço</h2>
            <p>
              A LWDigitalForge fornece aos usuários acesso a uma coleção de recursos, incluindo várias ferramentas de comunicação, fóruns, serviços de compra, conteúdo personalizado e programação de marca através de sua rede de propriedades que podem ser acessadas através de vários meios ou dispositivos agora conhecidos ou desenvolvidos posteriormente.
            </p>

            <h2>3. Uso da Licença</h2>
            <p>
              A permissão é concedida para baixar temporariamente uma cópia dos materiais (informação ou software) no site da LWDigitalForge, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título.
            </p>
            
            <p>[Conteúdo placeholder - este não é um documento legal real.]</p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PaginaTermos;