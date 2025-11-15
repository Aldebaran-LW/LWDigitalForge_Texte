import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const PaginaTermos = () => {
  return (
    <>
      <Helmet>
        <title>Termos de Uso - LWDigitalForge</title>
        <meta name="description" content="Leia nossos Termos de Uso para entender as regras de uso de nossos produtos e plataforma." />
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
              Termos de Uso
            </h1>
            <p className="text-lg text-gray-600 dark:text-[#F9FAFB]/80">
              Última atualização: 9 de Novembro de 2025
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="prose dark:prose-invert max-w-none bg-white dark:bg-[#111827]/50 p-8 rounded-xl border border-gray-200 dark:border-[#3B82F6]/20"
          >
            <p>Bem-vindo à LWDigitalForge!</p>
            <p>Estes Termos de Uso ("Termos") governam seu acesso e uso de nosso site, serviços, ferramentas de comunicação, fóruns, serviços de compra e qualquer outro conteúdo ou funcionalidade oferecida pela LWDigitalForge (coletivamente, os "Serviços").</p>
            <p>Por favor, leia estes Termos cuidadosamente antes de usar nossos Serviços.</p>
            
            <h2>1. Aceitação dos Termos</h2>
            <p>Ao acessar, se cadastrar ou usar os Serviços da LWDigitalForge, você confirma que leu, entendeu e concorda em estar vinculado a estes Termos e à nossa Política de Privacidade. Se você não concordar com qualquer parte destes Termos, você não deve acessar ou usar nossos Serviços.</p>
            
            <h2>2. Descrição dos Serviços</h2>
            <p>A LWDigitalForge fornece aos usuários acesso a uma plataforma online que pode incluir, mas não se limita a, venda de produtos e serviços digitais, ferramentas de comunicação, fóruns de discussão, conteúdo personalizado e outras funcionalidades que possam ser desenvolvidas futuramente ("Serviços").</p>

            <h2>3. Contas de Usuário e Segurança</h2>
            <p><strong>Cadastro:</strong> Para acessar certas funcionalidades, pode ser necessário criar uma conta. Você concorda em fornecer informações verdadeiras, precisas, atuais e completas durante o processo de registro.</p>
            <p><strong>Responsabilidade:</strong> Você é o único responsável por todas as atividades que ocorrem em sua conta. Mantenha a confidencialidade de sua senha e não a compartilhe com terceiros.</p>
            <p><strong>Segurança:</strong> Você concorda em nos notificar imediatamente sobre qualquer uso não autorizado de sua conta ou qualquer outra violação de segurança. A LWDigitalForge não será responsável por quaisquer perdas ou danos decorrentes de sua falha em cumprir esta cláusula.</p>

            <h2>4. Conduta e Obrigações do Usuário</h2>
            <p>Você concorda em usar os Serviços apenas para fins lícitos e de acordo com estes Termos. Você se compromete a não:</p>
            <ul>
              <li>Publicar, enviar ou transmitir qualquer conteúdo que seja ilegal, prejudicial, ameaçador, abusivo, difamatório, vulgar, obsceno ou odioso.</li>
              <li>Personificar qualquer pessoa ou entidade, ou declarar falsamente sua afiliação a uma pessoa ou entidade.</li>
              <li>Violar quaisquer leis locais, estaduais, nacionais ou internacionais aplicáveis.</li>
              <li>Coletar ou armazenar dados pessoais de outros usuários sem o consentimento deles.</li>
              <li>Interferir ou interromper os Serviços, servidores ou redes conectadas aos Serviços.</li>
            </ul>

            <h2>5. Compras, Pagamentos e Faturamento</h2>
            <p><strong>Preços:</strong> Todos os preços de produtos e serviços estão sujeitos a alterações sem aviso prévio.</p>
            <p><strong>Pagamento:</strong> Ao fornecer informações de pagamento, você declara e garante que as informações são precisas e que você está autorizado a usar o método de pagamento fornecido.</p>
            <p><strong>Faturamento:</strong> Você concorda em pagar todas as cobranças incorridas em sua conta pelos preços em vigor no momento em que as cobranças foram incorridas.</p>
            <p><strong>Cancelamento e Reembolso:</strong> As políticas de cancelamento e reembolso, se aplicáveis, serão especificadas na descrição do produto ou serviço adquirido.</p>

            <h2>6. Propriedade Intelectual</h2>
            <p><strong>Nossos Direitos:</strong> Todo o conteúdo incluído nos Serviços, como texto, gráficos, logotipos, ícones, imagens e software, é propriedade da LWDigitalForge ou de seus fornecedores de conteúdo e protegido pelas leis de direitos autorais.</p>

            <h2>7. Rescisão</h2>
            <p>Reservamo-nos o direito de suspender ou encerrar seu acesso aos Serviços, a nosso exclusivo critério, sem aviso prévio e por qualquer motivo, incluindo, sem limitação, a violação destes Termos.</p>

            <h2>8. Isenção de Garantias e Limitação de Responsabilidade</h2>
            <p>Os Serviços são fornecidos "COMO ESTÃO" e "CONFORME DISPONÍVEL", sem garantias de qualquer tipo. A LWDigitalForge não garante que os Serviços serão ininterruptos, seguros ou livres de erros.</p>
            <p>Em nenhuma circunstância a LWDigitalForge, seus diretores, funcionários ou afiliados serão responsáveis por quaisquer danos indiretos, incidentais, especiais ou consequenciais decorrentes do seu uso ou incapacidade de usar os Serviços.</p>

            <h2>9. Alterações nos Termos</h2>
            <p>Reservamo-nos o direito de modificar ou substituir estes Termos a qualquer momento. Se uma revisão for material, faremos o possível para fornecer um aviso com pelo menos 30 dias de antecedência. O que constitui uma alteração material será determinado a nosso exclusivo critério.</p>

            <h2>10. Lei Aplicável e Jurisdição</h2>
            <p>Estes Termos serão regidos e interpretados de acordo com as leis da República Federativa do Brasil, sem levar em conta o conflito de disposições legais. Fica eleito o foro da comarca de Rinópolis/SP, Brasil, para dirimir quaisquer controvérsias oriundas destes Termos.</p>

            <h2>11. Contato</h2>
            <p>Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco através do e-mail: <a href="mailto:lwdigitalforge@gmail.com" className="text-blue-500 hover:underline">lwdigitalforge@gmail.com</a>.</p>

          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PaginaTermos;