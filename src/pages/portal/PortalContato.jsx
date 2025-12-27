
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Send,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PortalContato = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.full_name || '',
    email: profile?.email || user?.email || '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  // Preencher formulário se vier do state (ex: de PortalAssinaturas)
  useEffect(() => {
    if (location.state?.subject) {
      setFormData(prev => ({
        ...prev,
        subject: location.state.subject,
        message: location.state.message || prev.message
      }));
    }
  }, [location.state]);

  // Atualizar quando o profile carregar
  useEffect(() => {
    if (profile?.full_name && !formData.name) {
      setFormData(prev => ({
        ...prev,
        name: profile.full_name || prev.name,
        email: profile.email || user?.email || prev.email
      }));
    }
  }, [profile, user, formData.name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Salvar mensagem no banco de dados
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          user_id: user?.id || null,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          status: 'PENDING'
        });

      if (error) throw error;
      
      toast({
        title: 'Mensagem enviada!',
        description: 'Nossa equipe entrará em contato em breve.',
      });
      
      setSubmitted(true);
      setFormData({
        name: profile?.full_name || user?.email?.split('@')[0] || '',
        email: profile?.email || user?.email || '',
        subject: '',
        message: ''
      });
      
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível enviar a mensagem. Tente novamente ou entre em contato por email.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Helmet>
        <title>Contato - Portal LWDigitalForge</title>
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Fale Conosco
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Estamos aqui para ajudar. Entre em contato conosco!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Informações de Contato
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Email</p>
                    <a 
                      href="mailto:lwdigitalforge@gmail.com" 
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      lwdigitalforge@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Suporte</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Respondemos em até 24 horas
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Precisa de ajuda urgente?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Para questões urgentes relacionadas à sua conta ou pagamentos, 
                envie um email com "URGENTE" no assunto.
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
          >
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Mensagem Enviada!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Nossa equipe entrará em contato em breve.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Assunto</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Ex: Problema com produto, Dúvida sobre assinatura..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Mensagem</Label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descreva sua dúvida ou problema..."
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PortalContato;

