# 🎛️ Funcionalidades Admin: Gerenciamento de Acesso aos Apps

## 🎯 Objetivo

Criar uma interface administrativa para gerenciar o acesso aos aplicativos de forma **fluida e automática**, sem precisar configurar manualmente no banco de dados.

## 📋 Funcionalidades Propostas

### **1. Configuração Automática de Verificação de Acesso**

#### **1.1. Painel de Configuração de Acesso no Formulário de Produto**

Adicionar uma seção no formulário de produto (`AdminFormularioProduto.jsx`) para:

- ✅ **Ativar/Desativar verificação de acesso** (checkbox)
- ✅ **URL de deploy** (já existe, mas melhorar validação)
- ✅ **Testar conexão** (botão para verificar se a URL está acessível)
- ✅ **Detectar Product ID automaticamente** (botão que busca o ID do produto atual)
- ✅ **Visualizar configuração atual** (mostrar como está configurado)

**Interface:**
```jsx
// Seção no formulário de produto
<div className="space-y-4 border-t pt-6">
  <h3 className="text-lg font-semibold">🔐 Configuração de Acesso</h3>
  
  <div className="flex items-center space-x-2">
    <input 
      type="checkbox" 
      checked={enableAccessVerification}
      onChange={(e) => setEnableAccessVerification(e.target.checked)}
    />
    <label>Ativar verificação de acesso para este produto</label>
  </div>
  
  {enableAccessVerification && (
    <div className="space-y-4 pl-6 border-l-2">
      <div>
        <label>URL de Deploy (Vercel)</label>
        <input 
          type="url"
          value={vercelDeploymentUrl}
          onChange={(e) => setVercelDeploymentUrl(e.target.value)}
          placeholder="https://jornadapro.lwdigitalforge.com"
        />
        <p className="text-xs text-gray-500">
          Esta URL será usada para detectar automaticamente o Product ID
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={testConnection}>
          🧪 Testar Conexão
        </Button>
        <Button onClick={detectProductId} variant="outline">
          🔍 Detectar Product ID
        </Button>
      </div>
      
      {productId && (
        <div className="p-3 bg-green-50 rounded">
          <p className="text-sm">
            ✅ Product ID detectado: <code>{productId}</code>
          </p>
        </div>
      )}
    </div>
  )}
</div>
```

---

### **2. Dashboard de Acesso aos Apps**

#### **2.1. Nova Página: `AdminAcessosApps.jsx`**

Criar uma página dedicada para gerenciar e monitorar o acesso aos apps:

**Funcionalidades:**
- 📊 **Visão geral** de todos os apps e seus status de verificação
- 🔍 **Buscar apps** por nome ou domínio
- ✅ **Ativar/Desativar** verificação de acesso em massa
- 📈 **Estatísticas** de acesso (usuários com acesso, sem acesso, etc.)
- 🧪 **Testar verificação** de cada app
- 📝 **Logs de acesso** (tentativas de acesso negadas)

**Interface:**
```jsx
const AdminAcessosApps = () => {
  const [apps, setApps] = useState([]);
  const [stats, setStats] = useState(null);
  
  return (
    <div className="space-y-6">
      <h1>🔐 Gerenciamento de Acesso aos Apps</h1>
      
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total de Apps</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">{stats?.totalApps || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Com Verificação Ativa</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">{stats?.appsWithVerification || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Usuários com Acesso</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">{stats?.usersWithAccess || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tentativas Negadas (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">{stats?.deniedAttempts || 0}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabela de Apps */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>App</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Verificação</TableHead>
            <TableHead>Product ID</TableHead>
            <TableHead>Usuários</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apps.map(app => (
            <TableRow key={app.id}>
              <TableCell>{app.name}</TableCell>
              <TableCell>
                <a href={app.vercel_deployment_url} target="_blank">
                  {app.vercel_deployment_url}
                </a>
              </TableCell>
              <TableCell>
                <Switch 
                  checked={app.enable_access_verification}
                  onCheckedChange={(checked) => toggleVerification(app.id, checked)}
                />
              </TableCell>
              <TableCell>
                <code className="text-xs">{app.id}</code>
              </TableCell>
              <TableCell>
                {app.users_with_access || 0} usuários
              </TableCell>
              <TableCell>
                <Button size="sm" onClick={() => testAppAccess(app.id)}>
                  🧪 Testar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
```

---

### **3. Assistente de Configuração Automática**

#### **3.1. Wizard de Configuração**

Criar um assistente passo a passo para configurar um novo app:

**Passos:**
1. ✅ Selecionar produto existente ou criar novo
2. ✅ Informar URL de deploy
3. ✅ Testar conexão
4. ✅ Detectar Product ID automaticamente
5. ✅ Ativar verificação de acesso
6. ✅ Testar verificação completa

**Interface:**
```jsx
const ConfiguracaoAcessoWizard = () => {
  const [step, setStep] = useState(1);
  const [productId, setProductId] = useState(null);
  const [deploymentUrl, setDeploymentUrl] = useState('');
  
  const steps = [
    { id: 1, title: 'Selecionar Produto' },
    { id: 2, title: 'Configurar URL' },
    { id: 3, title: 'Detectar Product ID' },
    { id: 4, title: 'Ativar Verificação' },
    { id: 5, title: 'Testar' },
  ];
  
  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div className={step >= s.id ? 'bg-blue-500' : 'bg-gray-300'}>
              {s.id}
            </div>
            <span>{s.title}</span>
            {i < steps.length - 1 && <div className="w-20 h-1 bg-gray-300" />}
          </div>
        ))}
      </div>
      
      {/* Conteúdo do Step */}
      {step === 1 && <SelectProductStep />}
      {step === 2 && <ConfigureUrlStep />}
      {step === 3 && <DetectProductIdStep />}
      {step === 4 && <ActivateVerificationStep />}
      {step === 5 && <TestStep />}
    </div>
  );
};
```

---

### **4. Monitoramento e Logs**

#### **4.1. Logs de Acesso**

Registrar tentativas de acesso para análise:

**Tabela: `access_logs`**
```sql
CREATE TABLE access_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  app_id UUID REFERENCES registered_apps(id),
  access_granted BOOLEAN,
  reason TEXT, -- 'has_purchase', 'has_trial', 'no_access', etc.
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Interface de Logs:**
```jsx
const AdminAccessLogs = () => {
  return (
    <div>
      <h1>📋 Logs de Acesso</h1>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data/Hora</TableHead>
            <TableHead>Usuário</TableHead>
            <TableHead>App</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead>IP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map(log => (
            <TableRow key={log.id}>
              <TableCell>{formatDate(log.created_at)}</TableCell>
              <TableCell>{log.user_email}</TableCell>
              <TableCell>{log.app_name}</TableCell>
              <TableCell>
                {log.access_granted ? (
                  <Badge variant="success">✅ Permitido</Badge>
                ) : (
                  <Badge variant="destructive">❌ Negado</Badge>
                )}
              </TableCell>
              <TableCell>{log.reason}</TableCell>
              <TableCell>{log.ip_address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
```

---

### **5. Testes e Validação**

#### **5.1. Botão "Testar Acesso" no Admin**

Permitir que o admin teste a verificação de acesso de qualquer usuário:

**Interface:**
```jsx
const TestAccessModal = ({ appId, userId }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const testAccess = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/test-access`, {
        method: 'POST',
        body: JSON.stringify({ appId, userId }),
      });
      const data = await response.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>🧪 Testar Acesso</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label>Usuário</label>
            <UserSelect value={userId} onChange={setUserId} />
          </div>
          
          <Button onClick={testAccess} disabled={loading}>
            {loading ? 'Testando...' : 'Testar Acesso'}
          </Button>
          
          {result && (
            <div className={`p-4 rounded ${result.hasAccess ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className="font-semibold">
                {result.hasAccess ? '✅ Acesso Permitido' : '❌ Acesso Negado'}
              </p>
              <p className="text-sm">{result.reason}</p>
              {result.details && (
                <pre className="text-xs mt-2">{JSON.stringify(result.details, null, 2)}</pre>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

---

### **6. Configurações Globais**

#### **6.1. Painel de Configurações**

Adicionar configurações globais para verificação de acesso:

**Interface:**
```jsx
const AdminAccessSettings = () => {
  return (
    <div className="space-y-6">
      <h1>⚙️ Configurações de Acesso</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Comportamento Padrão</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label>Permitir acesso se Product ID não for encontrado</label>
              <p className="text-sm text-gray-500">
                Se ativado, usuários terão acesso mesmo se a detecção automática falhar
              </p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label>Registrar logs de acesso</label>
              <p className="text-sm text-gray-500">
                Salvar todas as tentativas de acesso no banco de dados
              </p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label>Notificar admin sobre tentativas negadas</label>
              <p className="text-sm text-gray-500">
                Enviar email quando houver múltiplas tentativas negadas
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
```

---

## 📝 Implementação: Adicionar ao Formulário de Produto

### **Atualizar `AdminFormularioProduto.jsx`**

```jsx
// Adicionar estado
const [enableAccessVerification, setEnableAccessVerification] = useState(false);
const [productIdDetected, setProductIdDetected] = useState(null);
const [testingConnection, setTestingConnection] = useState(false);

// Função para detectar Product ID
const detectProductId = async () => {
  if (!vercelDeploymentUrl) {
    toast({
      variant: 'destructive',
      title: 'Erro',
      description: 'Informe a URL de deploy primeiro',
    });
    return;
  }
  
  try {
    // O Product ID é o próprio ID do produto
    setProductIdDetected(id || 'Novo produto - será gerado ao salvar');
    toast({
      title: 'Sucesso',
      description: 'Product ID detectado!',
    });
  } catch (error) {
    toast({
      variant: 'destructive',
      title: 'Erro',
      description: 'Não foi possível detectar o Product ID',
    });
  }
};

// Função para testar conexão
const testConnection = async () => {
  if (!vercelDeploymentUrl) {
    toast({
      variant: 'destructive',
      title: 'Erro',
      description: 'Informe a URL de deploy primeiro',
    });
    return;
  }
  
  setTestingConnection(true);
  try {
    const response = await fetch(vercelDeploymentUrl, { method: 'HEAD' });
    if (response.ok) {
      toast({
        title: 'Sucesso',
        description: 'URL está acessível!',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Aviso',
        description: 'URL retornou status ' + response.status,
      });
    }
  } catch (error) {
    toast({
      variant: 'destructive',
      title: 'Erro',
      description: 'Não foi possível acessar a URL',
    });
  } finally {
    setTestingConnection(false);
  }
};

// Adicionar ao formulário (antes do botão de salvar)
<div className="space-y-4 border-t pt-6 mt-6">
  <h3 className="text-lg font-semibold flex items-center gap-2">
    <Lock className="w-5 h-5" />
    Configuração de Acesso
  </h3>
  
  <div className="flex items-center space-x-2">
    <input
      type="checkbox"
      id="enableAccessVerification"
      checked={enableAccessVerification}
      onChange={(e) => setEnableAccessVerification(e.target.checked)}
      className="w-4 h-4"
    />
    <label htmlFor="enableAccessVerification" className="text-sm">
      Ativar verificação de acesso para este produto
    </label>
  </div>
  
  {enableAccessVerification && (
    <div className="space-y-4 pl-6 border-l-2 border-blue-200 bg-blue-50/50 p-4 rounded">
      <div>
        <label className="block text-sm font-medium mb-1">
          URL de Deploy (Vercel) *
        </label>
        <input
          type="url"
          {...register('vercel_deployment_url')}
          className="w-full p-2 bg-white border rounded-md"
          placeholder="https://jornadapro.lwdigitalforge.com"
        />
        <p className="text-xs text-gray-500 mt-1">
          Esta URL será usada para detectar automaticamente o Product ID quando usuários acessarem o app
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={testConnection}
          disabled={testingConnection || !watch('vercel_deployment_url')}
        >
          {testingConnection ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testando...
            </>
          ) : (
            <>
              🧪 Testar Conexão
            </>
          )}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={detectProductId}
          disabled={!id}
        >
          🔍 Detectar Product ID
        </Button>
      </div>
      
      {productIdDetected && (
        <div className="p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-sm font-medium text-green-800">
            ✅ Product ID detectado:
          </p>
          <code className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
            {productIdDetected}
          </code>
          <p className="text-xs text-green-600 mt-2">
            Este ID será usado automaticamente para verificar acesso quando usuários acessarem o app
          </p>
        </div>
      )}
      
      <div className="p-3 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm font-medium text-blue-800 mb-2">
          ℹ️ Como funciona:
        </p>
        <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
          <li>O app detecta automaticamente o Product ID pelo domínio da URL</li>
          <li>Verifica se o usuário tem compra/assinatura/trial ativo</li>
          <li>Bloqueia acesso se o usuário não tiver permissão</li>
        </ul>
      </div>
    </div>
  )}
</div>
```

---

## 🎯 Resumo das Funcionalidades

### **No Formulário de Produto:**
1. ✅ Checkbox para ativar verificação de acesso
2. ✅ Campo de URL de deploy (com validação)
3. ✅ Botão para testar conexão
4. ✅ Botão para detectar Product ID
5. ✅ Visualização do Product ID detectado
6. ✅ Explicação de como funciona

### **Nova Página de Gerenciamento:**
1. ✅ Dashboard com estatísticas
2. ✅ Lista de todos os apps
3. ✅ Ativar/Desativar verificação em massa
4. ✅ Testar acesso de qualquer app
5. ✅ Ver logs de acesso

### **Funcionalidades Extras:**
1. ✅ Wizard de configuração
2. ✅ Logs de acesso
3. ✅ Testes de acesso
4. ✅ Configurações globais

---

**Resultado:** O admin pode gerenciar tudo de forma **fluida e visual**, sem precisar mexer no banco de dados manualmente! 🎉









