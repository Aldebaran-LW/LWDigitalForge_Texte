import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Target, Zap, Users } from 'lucide-react';

const PaginaSobre = () => {
  return (
    <>
      <Helmet>
        <title>Sobre Nós - LWDigitalForge</title>
        <meta name="description" content="Conheça a história e a missão da LWDigitalForge, sua parceira em automação e produtividade." />
      </Helmet>
      <div className="py-28 px-4 bg-[#F9FAFB] dark:bg-[#0D1117]">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Nossa História
            </h1>
            <p className="text-xl text-gray-600 dark:text-[#F9FAFB]/80 max-w-3xl mx-auto">
              Nascemos da paixão por tecnologia e da busca incessante por eficiência.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto bg-white dark:bg-[#0D1117]/50 p-8 rounded-xl border border-gray-200 dark:border-[#3B82F6]/20"
          >
            <p className="text-lg text-gray-700 dark:text-[#F9FAFB]/90 mb-6 leading-relaxed">
              A LWDigitalForge começou como um pequeno projeto paralelo, uma ideia simples: "E se pudéssemos automatizar as tarefas chatas e repetitivas que consomem nosso tempo?". O que era um hobby rapidamente se tornou uma obsessão. Vimos o poder transformador da automação em nossas próprias vidas e soubemos que precisávamos compartilhar isso com o mundo.
            </p>
            <p className="text-lg text-gray-700 dark:text-[#F9FAFB]/90 leading-relaxed">
              Hoje, somos uma equipe dedicada de desenvolvedores, designers e estrategistas com a missão de criar ferramentas que não apenas economizam tempo, mas também capacitam pessoas e empresas a alcançarem seu verdadeiro potencial. Acreditamos que a tecnologia deve trabalhar para nós, liberando nossa criatividade e foco para o que realmente importa.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mt-16 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <div className="p-8 bg-white dark:bg-[#0D1117]/50 rounded-xl border border-gray-200 dark:border-[#14B8A6]/20">
                <Target className="mx-auto text-[#3B82F6]" size={40} />
                <h3 className="text-2xl font-bold my-4">Nossa Missão</h3>
                <p className="text-gray-600 dark:text-[#F9FAFB]/70">
                  Democratizar a automação, tornando-a acessível e fácil de usar para todos.
                </p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
              <div className="p-8 bg-white dark:bg-[#0D1117]/50 rounded-xl border border-gray-200 dark:border-[#14B8A6]/20">
                <Zap className="mx-auto text-[#14B8A6]" size={40} />
                <h3 className="text-2xl font-bold my-4">Nossa Visão</h3>
                <p className="text-gray-600 dark:text-[#F9FAFB]/70">
                  Ser a principal referência em soluções de produtividade inteligente no mercado.
                </p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
              <div className="p-8 bg-white dark:bg-[#0D1117]/50 rounded-xl border border-gray-200 dark:border-[#14B8A6]/20">
                <Users className="mx-auto text-[#D946EF]" size={40} />
                <h3 className="text-2xl font-bold my-4">Nossos Valores</h3>
                <p className="text-gray-600 dark:text-[#F9FAFB]/70">
                  Inovação, simplicidade, foco no cliente e integridade em tudo que fazemos.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaginaSobre;