import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Mail, 
  User, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Trash2,
  Search,
  Filter,
  Loader2,
  Eye,
  Reply
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const AdminContato = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, PENDING, READ, REPLIED
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      setMessages(data || []);
      const unread = (data || []).filter(m => m.status !== 'READ').length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar as mensagens.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: 'READ' })
        .eq('id', messageId);

      if (error) throw error;

      toast({
        title: 'Mensagem marcada como lida',
      });
      fetchMessages();
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível marcar a mensagem como lida.',
      });
    }
  };

  const handleMarkAsReplied = async (messageId) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: 'REPLIED' })
        .eq('id', messageId);

      if (error) throw error;

      toast({
        title: 'Mensagem marcada como respondida',
      });
      fetchMessages();
    } catch (error) {
      console.error('Erro ao marcar como respondida:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível marcar a mensagem como respondida.',
      });
    }
  };

  const handleDelete = async (messageId) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      toast({
        title: 'Mensagem excluída',
      });
      fetchMessages();
    } catch (error) {
      console.error('Erro ao excluir mensagem:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível excluir a mensagem.',
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'REPLIED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'READ':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-orange-500" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'REPLIED':
        return 'Respondida';
      case 'READ':
        return 'Lida';
      default:
        return 'Pendente';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'REPLIED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'READ':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      msg.name?.toLowerCase().includes(search) ||
      msg.email?.toLowerCase().includes(search) ||
      msg.subject?.toLowerCase().includes(search) ||
      msg.message?.toLowerCase().includes(search)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Mensagens de Contato - Admin</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Mensagens de Contato
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {unreadCount > 0 
                ? `${unreadCount} mensagem${unreadCount > 1 ? 'ns' : ''} não lida${unreadCount > 1 ? 's' : ''}`
                : 'Todas as mensagens foram lidas'
              }
            </p>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nome, email, assunto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="PENDING">Pendentes</SelectItem>
              <SelectItem value="READ">Lidas</SelectItem>
              <SelectItem value="REPLIED">Respondidas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de Mensagens */}
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || statusFilter !== 'all'
                ? 'Nenhuma mensagem encontrada com os filtros aplicados'
                : 'Nenhuma mensagem recebida ainda'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMessages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white dark:bg-gray-800 rounded-lg border-2 p-5 hover:shadow-lg transition-all ${
                  message.status === 'PENDING'
                    ? 'border-orange-300 dark:border-orange-700'
                    : message.status === 'READ'
                    ? 'border-blue-200 dark:border-blue-800'
                    : 'border-green-200 dark:border-green-800'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 dark:text-white truncate">
                          {message.name || 'Sem nome'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          {message.email}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                        {message.subject}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {message.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(message.created_at)}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(message.status)}`}>
                        {getStatusIcon(message.status)}
                        {getStatusLabel(message.status)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedMessage(message);
                        setIsDetailOpen(true);
                        if (message.status === 'PENDING') {
                          handleMarkAsRead(message.id);
                        }
                      }}
                      className="w-full"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver
                    </Button>

                    {message.status === 'PENDING' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(message.id)}
                        className="w-full"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Marcar como lida
                      </Button>
                    )}

                    {message.status !== 'REPLIED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsReplied(message.id)}
                        className="w-full"
                      >
                        <Reply className="w-4 h-4 mr-2" />
                        Respondida
                      </Button>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir mensagem</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir esta mensagem? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(message.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Dialog de Detalhes */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedMessage?.subject}</DialogTitle>
              <DialogDescription>
                Mensagem de {selectedMessage?.name}
              </DialogDescription>
            </DialogHeader>

            {selectedMessage && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">De:</label>
                  <p className="text-gray-900 dark:text-white">{selectedMessage.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedMessage.email}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data:</label>
                  <p className="text-gray-900 dark:text-white">{formatDate(selectedMessage.created_at)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
                  <p className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedMessage.status)}`}>
                    {getStatusLabel(selectedMessage.status)}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mensagem:</label>
                  <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                Fechar
              </Button>
              {selectedMessage?.status !== 'REPLIED' && (
                <Button onClick={() => {
                  handleMarkAsReplied(selectedMessage.id);
                  setIsDetailOpen(false);
                }}>
                  <Reply className="w-4 h-4 mr-2" />
                  Marcar como respondida
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AdminContato;

