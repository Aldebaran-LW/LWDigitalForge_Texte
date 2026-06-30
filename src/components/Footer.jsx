import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Mail, Phone, ArrowUpRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { getAssetUrl } from '@/config/assets';

const Footer = () => {
  const handleSocialClick = (linkName) => {
    toast({
      title: '🚧 Em breve!',
      description: `O link para nosso ${linkName} será adicionado em breve!`,
    });
  };

  const socialLinks = [
    { icon: Instagram, name: 'Instagram', color: '#D946EF' },
    { icon: Linkedin, name: 'LinkedIn', color: '#3B82F6' },
    { icon: Mail, name: 'Email', color: '#06B6D4' },
    { icon: Phone, name: 'WhatsApp', color: '#10B981' },
  ];

  const navLinks = [
    { to: '/produtos', label: 'Soluções' },
    { to: '/blog', label: 'Blog' },
    { to: '/docs', label: 'Documentação' },
    { to: '/sobre', label: 'Sobre Nós' },
    { to: '/contato-orcamento', label: 'Contato' },
    { to: '/login', label: 'Área do Cliente' },
  ];

  const legalLinks = [
    { to: '/termos-de-servico', label: 'Termos de Serviço' },
    { to: '/politica-de-privacidade', label: 'Política de Privacidade' },
  ];

  return (
    <footer className="relative bg-gray-950 dark:bg-[#030712] border-t border-white/8 overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full bg-blue-600/5 blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-6 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Brand col */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="md:col-span-5"
          >
            <Link to="/" className="flex items-center gap-2 mb-5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center overflow-hidden">
                <img
                  src={getAssetUrl('Logo')}
                  alt="LW Digital Forge logo"
                  className="w-full h-full object-contain p-0"
                  draggable={false}
                />
              </div>
              <span className="text-lg font-bold text-white">
                LW<span className="text-blue-400">Digital</span>Forge
              </span>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
              Especialistas em desenvolvimento de aplicações web e sites personalizados. 
              Transformamos ideias em soluções digitais que geram resultados reais.
            </p>

            {/* Social */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.button
                  key={social.name}
                  onClick={() => handleSocialClick(social.name)}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all duration-200"
                  style={{ '--hover-color': social.color }}
                  aria-label={social.name}
                >
                  <social.icon size={16} className="text-gray-400 hover:text-white transition-colors" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Nav links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
            className="md:col-span-3"
          >
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
              Navegação
            </p>
            <ul className="space-y-3">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="group flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
            className="md:col-span-4"
          >
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
              Legal
            </p>
            <ul className="space-y-3">
              {legalLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="group flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact info */}
            <div className="mt-6 pt-5 border-t border-white/6">
              <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-3">
                Contato
              </p>
              <Link
                to="/contato-orcamento"
                className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2"
              >
                <Mail size={14} />
                Solicitar Orçamento
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          viewport={{ once: true }}
          className="pt-7 border-t border-white/6 flex flex-col sm:flex-row justify-between items-center gap-3"
        >
          <p className="text-xs text-gray-600">
            © 2025 LWDigitalForge. Todos os direitos reservados.
          </p>
          <p className="text-xs text-gray-600 flex items-center gap-1.5">
            Feito com 
            <span className="text-red-500">♥</span>
            para impulsionar seu negócio
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
