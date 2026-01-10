import { useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';

/**
 * Componente Admin para verificar assinatura de qualquer usuário
 * 
 * @example
 * <AdminCheckSubscription />
 */
export function AdminCheckSubscription() {
  const { checkSubscription, loading, error } = useSubscription();
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [appId, setAppId] = useState('');
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    if (!userId || !email || !appId) {
      return;
    }

    const data = await checkSubscription({ userId, email, appId });
    setResult(data);
  };

  const handleClear = () => {
    setUserId('');
    setEmail('');
    setAppId('');
    setResult(null);
  };

  return (
    <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Verificar Assinatura de Usuário
      </h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="userId" className="text-sm font-medium">
            User ID (UUID)
          </Label>
          <Input
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="550e8400-e29b-41d4-a716-446655440000"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@exemplo.com"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="appId" className="text-sm font-medium">
            App ID / Product ID (UUID) *
          </Label>
          <Input
            id="appId"
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
            placeholder="550e8400-e29b-41d4-a716-446655440000"
            className="mt-1"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            * Obrigatório para verificar acesso a um app específico
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleCheck} 
            disabled={loading || !userId || !email || !appId}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Verificando...
              </>
            ) : (
              'Verificar Assinatura'
            )}
          </Button>
          
          {result && (
            <Button 
              onClick={handleClear}
              variant="outline"
            >
              Limpar
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">
            Erro: {error}
          </p>
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <h4 className="font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
            Resultado:
            {result.hasAccess ? (
              <CheckCircle className="h-5 w-5 ml-2 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 ml-2 text-red-500" />
            )}
          </h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Tem Acesso:</span>
              <span className={`font-semibold ${result.hasAccess ? 'text-green-600' : 'text-red-600'}`}>
                {result.hasAccess ? 'Sim' : 'Não'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">É Assinante:</span>
              <span className="font-semibold">
                {result.isSubscriber ? 'Sim' : 'Não'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Está em Trial:</span>
              <span className="font-semibold">
                {result.isTrial ? 'Sim' : 'Não'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span className="font-semibold capitalize">
                {result.subscriptionStatus}
              </span>
            </div>
            
            {result.expiresAt && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Expira em:
                </span>
                <span className="font-semibold">
                  {new Date(result.expiresAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}
            
            {result.trialExpiresAt && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Trial expira em:
                </span>
                <span className="font-semibold">
                  {new Date(result.trialExpiresAt).toLocaleDateString('pt-BR')}
                  {result.daysRemaining !== null && result.daysRemaining !== undefined && (
                    <span className="ml-2 text-yellow-600">
                      ({result.daysRemaining} dias restantes)
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
          
          <details className="mt-4">
            <summary className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200">
              Ver JSON completo
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto max-h-60">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}

