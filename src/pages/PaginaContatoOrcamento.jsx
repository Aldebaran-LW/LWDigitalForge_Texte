import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { User, Mail, Phone, MessageSquare, Send, MapPin, Clock, CheckCircle2 } from 'lucide-react';

const PaginaContatoOrcamento = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: '✅ Orçamento Enviado!',
      description: 'Recebemos sua solicitação. Nossa equipe entrará em contato em breve.',
    });
    e.target.reset();
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'E-mail',
      value: 'contato@lwdigitalforge.com',
      color: '#3B82F6',
    },
    {
      icon: Phone,
      title: 'WhatsApp',
      value: '+55 (XX) XXXXX-XXXX',
      color: '#10B981',
    },
    {
      icon: Clock,
      title: 'Horário',
      value: 'Seg-Sex: 9h às 18h',
      color: '#F59E0B',
    },
    {
      icon: MapPin,
      title: 'Localização',
      value: 'Brasil — Atendimento Remoto',
      color: '#7C3AED',
    },
  ];

  const commitments = [
    'Resposta em até 24 horas úteis',
    'Orçamento sem compromisso',
    'Análise detalhada da sua necessidade',
    'Proposta personalizada para seu projeto',
  ];

  return (
    <>
      <Helmet>
        <title>Contato e Orçamento - LWDigitalForge</title>
        <meta name="description" content="Solicite um orçamento ou entre em contato conosco." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-24 pb-16 px-6 bg-gradient-to-b from-[#F0F4FF] to-white dark:from-[#080C14] dark:to-[#0D1526] overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40 dark:opacity-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-blue-500/6 dark:bg-blue-500/8 blur-[120px] pointer-events-none" />

        <div className="container mx-auto relative z-10 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wider uppercase"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Fale Conosco
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold mb-4 leading-tight text-gray-900 dark:text-white"
          >
            Tem uma ideia?
            <br />
            <span className="text-gradient">Vamos construir juntos</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-500 dark:text-gray-400 text-base max-w-xl mx-auto"
          >
            Descreva sua necessidade e nossa equipe elaborará uma proposta personalizada para seu projeto digital.
          </motion.p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16 px-6 bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-5 gap-10 max-w-6xl mx-auto">
            {/* Left — info panel */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Contact cards */}
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-blue-500 dark:text-blue-400 mb-4">
                  Informações de Contato
                </p>
                <div className="space-y-3">
                  {contactInfo.map((info, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#0D1526] border border-gray-200/80 dark:border-white/6"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${info.color}12`, border: `1px solid ${info.color}25` }}
                      >
                        <info.icon size={18} style={{ color: info.color }} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{info.title}</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commitments */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-700 text-white">
                <p className="text-xs font-semibold tracking-widest uppercase text-blue-200 mb-4">
                  Nossos compromissos
                </p>
                <div className="space-y-2.5">
                  {commitments.map((c, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 size={15} className="text-cyan-300 flex-shrink-0 mt-0.5" />
                      <span className="text-blue-100">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="p-8 rounded-3xl bg-white dark:bg-[#0D1526] border border-gray-200/80 dark:border-white/6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Solicitar Orçamento
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="name">
                        Nome Completo
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          id="name"
                          type="text"
                          placeholder="Seu nome"
                          required
                          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="email">
                        E-mail
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          required
                          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="phone">
                      Telefone / WhatsApp
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        id="phone"
                        type="tel"
                        placeholder="(XX) XXXXX-XXXX"
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="project-type">
                      Tipo de Projeto
                    </label>
                    <select
                      id="project-type"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                    >
                      <option value="">Selecione o tipo de projeto</option>
                      <option value="webapp">Aplicação Web / Sistema</option>
                      <option value="site">Site Institucional</option>
                      <option value="ecommerce">E-commerce / Loja Virtual</option>
                      <option value="bot">Bot Telegram</option>
                      <option value="automation">Automação de Processos</option>
                      <option value="other">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="message">
                      Descreva seu projeto
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                      <textarea
                        id="message"
                        placeholder="Ex: Preciso de um sistema para gestão de clientes com dashboard e relatórios..."
                        rows={5}
                        required
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all group"
                  >
                    <Send className="mr-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    Enviar Pedido de Orçamento
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PaginaContatoOrcamento;
