import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Mail, Phone } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { getAssetUrlFromStorage } from '@/config/assets';

const Footer = () => {
  const handleSocialClick = (linkName) => {
    toast({
      title: "🚧 Em breve!",
      description: `O link para nosso ${linkName} será adicionado em breve!`,
    });
  };

  const socialLinks = [
    { icon: Instagram, name: 'Instagram', color: '#D946EF' },
    { icon: Linkedin, name: 'LinkedIn', color: '#3B82F6' },
    { icon: Mail, name: 'Email', color: '#14B8A6' },
    { icon: Phone, name: 'WhatsApp', color: '#14B8A6' }
  ];

  return (
    <footer className="bg-[#0D1117] border-t border-[#3B82F6]/20">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <Link to="/" className="flex items-center mb-4">
              <img
                src={getAssetUrlFromStorage('Logo')}
                alt="LWDigitalForge Logo"
                className="h-8 mr-2"
              />
              <span className="text-2xl font-bold text-gradient hidden sm:block">
                LWDigitalForge
              </span>
            </Link>
            <p className="text-sm sm:text-base text-[#F9FAFB]/70 mb-4 sm:mb-6 max-w-md leading-relaxed">
              Transformamos ideias em soluções automatizadas que impulsionam sua produtividade. 
              Especialistas em bots Telegram e planilhas inteligentes.
            </p>
            
            <div className="flex space-x-3 sm:space-x-4">
              {socialLinks.map((social) => (
                <motion.button
                  key={social.name}
                  onClick={() => handleSocialClick(social.name)}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-[#2563EB]/10 to-[#14B8A6]/10 rounded-full flex items-center justify-center border border-transparent hover:border-current transition-all duration-300 min-h-[44px] min-w-[44px]"
                  style={{ color: social.color }}
                  aria-label={social.name}
                >
                  <social.icon size={20} />
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <span className="text-base sm:text-lg font-semibold text-[#F9FAFB] mb-3 sm:mb-4 block">
              Links Rápidos
            </span>
            <ul className="space-y-2 sm:space-y-3">
              <li><Link to="/produtos" className="text-sm sm:text-base text-[#F9FAFB]/70 hover:text-[#3B82F6] transition-colors duration-300 py-1 block min-h-[44px] flex items-center">Produtos</Link></li>
              <li><Link to="/sobre" className="text-sm sm:text-base text-[#F9FAFB]/70 hover:text-[#3B82F6] transition-colors duration-300 py-1 block min-h-[44px] flex items-center">Sobre Nós</Link></li>
              <li><Link to="/contato-orcamento" className="text-sm sm:text-base text-[#F9FAFB]/70 hover:text-[#3B82F6] transition-colors duration-300 py-1 block min-h-[44px] flex items-center">Contato</Link></li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="text-base sm:text-lg font-semibold text-[#F9FAFB] mb-3 sm:mb-4 block">
              Legal
            </span>
            <ul className="space-y-2 sm:space-y-3">
              <li><Link to="/termos-de-servico" className="text-sm sm:text-base text-[#F9FAFB]/70 hover:text-[#3B82F6] transition-colors duration-300 py-1 block min-h-[44px] flex items-center">Termos de Serviço</Link></li>
              <li><Link to="/politica-de-privacidade" className="text-sm sm:text-base text-[#F9FAFB]/70 hover:text-[#3B82F6] transition-colors duration-300 py-1 block min-h-[44px] flex items-center">Política de Privacidade</Link></li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-[#3B82F6]/20 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-[#F9FAFB]/60 text-sm mb-4 md:mb-0">
            © 2025 LWDigitalForge. Todos os direitos reservados.
          </p>
        </motion.div>

        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#2563EB] via-[#14B8A6] to-[#D946EF] opacity-50" />
      </div>
    </footer>
  );
};

export default Footer;