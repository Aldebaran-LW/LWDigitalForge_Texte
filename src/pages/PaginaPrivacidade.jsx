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
              Última atualização: 9 de Novembro de 2025
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="prose dark:prose-invert max-w-none bg-white dark:bg-[#111827]/50 p-8 rounded-xl border border-gray-200 dark:border-[#3B82F6]/20"
          >
            <p>A sua privacidade é de extrema importância para a LWDigitalForge ("nós", "nosso"). Esta Política de Privacidade descreve como coletamos, usamos, armazenamos, compartilhamos e protegemos suas informações pessoais quando você utiliza nosso site e nossos serviços (coletivamente, os "Serviços").</p>
            <p>Ao utilizar nossos Serviços, você concorda com a coleta e uso de informações de acordo com esta política.</p>
            
            <h2>1. Informações que Coletamos</h2>
            <p>Podemos coletar os seguintes tipos de informações:</p>
            
            <h3>Informações Fornecidas por Você:</h3>
            <ul>
              <li><strong>Dados de Cadastro:</strong> Nome, endereço de e-mail, senha e outras informações que você fornece ao criar uma conta.</li>
              <li><strong>Dados de Compra:</strong> Informações de faturamento, endereço de entrega e detalhes de contato para processar seus pedidos.</li>
              <li><strong>Comunicações:</strong> Informações que você nos fornece ao entrar em contato com o suporte ao cliente ou ao participar de fóruns e pesquisas.</li>
            </ul>

            <h3>Informações Coletadas Automaticamente:</h3>
            <ul>
              <li><strong>Dados de Uso:</strong> Informações sobre como você interage com nossos Serviços, como páginas visitadas, cliques, tempo gasto nas páginas e funcionalidades utilizadas.</li>
              <li><strong>Dados de Dispositivo:</strong> Endereço IP, tipo de navegador, sistema operacional, informações de rede móvel e identificadores de dispositivo.</li>
            </ul>

            <h3>Cookies e Tecnologias Semelhantes:</h3>
            <p>Usamos cookies e tecnologias de rastreamento similares para operar e personalizar nossos Serviços, analisar nosso desempenho e para fins de marketing. Você pode controlar o uso de cookies nas configurações do seu navegador.</p>

            <h2>2. Como Usamos Suas Informações</h2>
            <p>Utilizamos as informações coletadas para os seguintes fins:</p>
            <ul>
              <li><strong>Fornecer e Manter os Serviços:</strong> Para operar nossa plataforma, processar transações e gerenciar contas de usuário.</li>
              <li><strong>Melhorar e Personalizar os Serviços:</strong> Para entender como nossos usuários interagem com os Serviços e personalizar sua experiência.</li>
              <li><strong>Comunicação:</strong> Para enviar notificações importantes, como confirmações de pedido, atualizações de segurança e responder às suas solicitações de suporte.</li>
              <li><strong>Marketing:</strong> Para enviar informações sobre produtos, promoções e ofertas especiais que possam ser do seu interesse, sempre com a opção de você cancelar o recebimento (opt-out).</li>
              <li><strong>Segurança e Prevenção de Fraudes:</strong> Para proteger nossos Serviços, nossa empresa e nossos usuários contra atividades fraudulentas ou ilegais.</li>
            </ul>

            <h2>3. Compartilhamento de Informações</h2>
            <p>Não vendemos suas informações pessoais. Podemos compartilhar suas informações com terceiros apenas nas seguintes circunstâncias:</p>
            <ul>
              <li><strong>Prestadores de Serviços:</strong> Com empresas que nos auxiliam na operação dos Serviços, como processadores de pagamento (ex: Mercado Pago), provedores de hospedagem (ex: Supabase) e ferramentas de análise. Esses parceiros são contratualmente obrigados a proteger suas informações.</li>
              <li><strong>Obrigações Legais:</strong> Se exigido por lei ou em resposta a solicitações válidas de autoridades públicas (por exemplo, um tribunal ou uma agência governamental).</li>
              <li><strong>Proteção de Direitos:</strong> Para proteger e defender os direitos ou propriedade da LWDigitalForge e a segurança de nossos usuários.</li>
            </ul>

            <h2>4. Segurança das Informações</h2>
            <p>Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela Internet ou de armazenamento eletrônico é 100% seguro.</p>

            <h2>5. Seus Direitos de Proteção de Dados</h2>
            <p>De acordo com a LGPD, você tem o direito de:</p>
            <ul>
              <li><strong>Acessar:</strong> Solicitar uma cópia das informações pessoais que temos sobre você.</li>
              <li><strong>Corrigir:</strong> Solicitar a correção de informações imprecisas ou incompletas.</li>
              <li><strong>Excluir:</strong> Solicitar a exclusão de suas informações pessoais.</li>
              <li><strong>Restringir o Processamento:</strong> Solicitar a limitação do uso de suas informações.</li>
              <li><strong>Portabilidade:</strong> Solicitar a transferência de seus dados para outra organização.</li>
            </ul>
            <p>Para exercer esses direitos, entre em contato conosco através dos canais listados na seção "Contato".</p>

            <h2>6. Retenção de Dados</h2>
            <p>Reteremos suas informações pessoais apenas pelo tempo necessário para os fins estabelecidos nesta Política de Privacidade, a menos que um período de retenção mais longo seja exigido ou permitido por lei.</p>

            <h2>7. Privacidade de Menores</h2>
            <p>Nossos Serviços não se destinam a menores de 18 anos. Não coletamos intencionalmente informações de identificação pessoal de menores. Se você é pai ou responsável e sabe que seu filho nos forneceu informações pessoais, entre em contato conosco.</p>

            <h2>8. Alterações nesta Política de Privacidade</h2>
            <p>Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos você sobre quaisquer alterações publicando a nova política nesta página e atualizando a data da "Última atualização".</p>

            <h2>9. Contato</h2>
            <p>Se você tiver alguma dúvida ou preocupação sobre esta Política de Privacidade, ou nossas práticas de dados, entre em contato conosco:</p>
            <p><strong>E-mail:</strong> <a href="mailto:lwdigitalforge@gmail.com" className="text-blue-500 hover:underline">lwdigitalforge@gmail.com</a></p>

          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PaginaPrivacidade;