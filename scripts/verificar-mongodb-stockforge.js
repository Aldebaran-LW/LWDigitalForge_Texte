// ========================================
// Script para Verificar MongoDB - StockForge
// ========================================
// Verifica conexão e estrutura do MongoDB para o StockForge
// ========================================

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// URI do MongoDB fornecida pelo usuário
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Vercel-Admin-Gerenciadorde-Estoque:y1p9QKGAmcPs2xQo@gerenciadorde-estoque.hcv0dlv.mongodb.net/?retryWrites=true&w=majority";

// Collections esperadas para o StockForge
const COLLECTIONS_ESPERADAS = {
  produtos: ['produtos', 'products', 'produto'],
  lancamentos: ['lancamentos', 'movements', 'transactions', 'entradas_saidas'],
  usuarios: ['usuarios', 'users', 'usuarios_stockforge'],
  empresas: ['empresas', 'companies', 'empresa'],
  categorias: ['categorias', 'categories', 'categoria']
};

// Cores para output no terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`  ${title}`, 'cyan');
  log('='.repeat(60), 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

async function verificarConexao(client) {
  logSection('1. Verificação de Conexão');
  
  try {
    await client.connect();
    logSuccess('Conexão estabelecida com sucesso!');
    
    // Verificar se está conectado
    await client.db().admin().ping();
    logSuccess('Ping ao servidor MongoDB bem-sucedido!');
    
    return true;
  } catch (error) {
    logError(`Erro ao conectar: ${error.message}`);
    if (error.message.includes('authentication failed')) {
      logError('Falha na autenticação. Verifique as credenciais.');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      logError('Não foi possível resolver o hostname. Verifique a URI.');
    }
    return false;
  }
}

async function verificarDatabase(client) {
  logSection('2. Informações do Banco de Dados');
  
  try {
    const db = client.db();
    const dbName = db.databaseName;
    
    logInfo(`Nome do banco: ${dbName}`);
    
    // Listar todas as databases disponíveis
    const adminDb = client.db().admin();
    const { databases } = await adminDb.listDatabases();
    
    logInfo(`\nDatabases disponíveis no cluster:`);
    databases.forEach(db => {
      log(`  - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`, 'blue');
    });
    
    return db;
  } catch (error) {
    logError(`Erro ao verificar database: ${error.message}`);
    throw error;
  }
}

async function verificarCollections(db) {
  logSection('3. Verificação de Collections');
  
  try {
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    logInfo(`Total de collections encontradas: ${collectionNames.length}`);
    logInfo(`Collections: ${collectionNames.join(', ')}\n`);
    
    const resultados = {};
    
    // Verificar cada tipo de collection esperada
    for (const [tipo, variacoes] of Object.entries(COLLECTIONS_ESPERADAS)) {
      let encontrada = false;
      let nomeEncontrado = null;
      let count = 0;
      let estrutura = null;
      
      for (const nome of variacoes) {
        if (collectionNames.includes(nome)) {
          encontrada = true;
          nomeEncontrado = nome;
          count = await db.collection(nome).countDocuments();
          
          // Obter estrutura de um documento de exemplo
          const sample = await db.collection(nome).findOne({});
          if (sample) {
            estrutura = Object.keys(sample);
          }
          break;
        }
      }
      
      resultados[tipo] = {
        encontrada,
        nomeEncontrado,
        count,
        estrutura
      };
      
      const status = encontrada ? '✅' : '❌';
      const nomeDisplay = nomeEncontrado || 'NÃO ENCONTRADA';
      log(`${status} ${tipo.padEnd(20)} | ${nomeDisplay.padEnd(25)} | ${count} documentos`);
      
      if (encontrada && estrutura) {
        log(`    Campos: ${estrutura.slice(0, 10).join(', ')}${estrutura.length > 10 ? '...' : ''}`, 'blue');
      }
    }
    
    return resultados;
  } catch (error) {
    logError(`Erro ao verificar collections: ${error.message}`);
    throw error;
  }
}

async function verificarDados(db, resultados) {
  logSection('4. Análise de Dados');
  
  try {
    // Verificar produtos se existir
    const produtosCollection = Object.values(resultados).find(r => 
      r.nomeEncontrado && (r.nomeEncontrado.includes('produto') || r.nomeEncontrado.includes('product'))
    );
    
    if (produtosCollection && produtosCollection.encontrada) {
      logInfo(`\n📦 Análise de ${produtosCollection.nomeEncontrado}:`);
      
      const produtos = await db.collection(produtosCollection.nomeEncontrado)
        .find({})
        .limit(5)
        .toArray();
      
      if (produtos.length > 0) {
        logSuccess(`${produtos.length} produtos encontrados (mostrando primeiros 5):`);
        produtos.forEach((prod, idx) => {
          log(`  ${idx + 1}. ${JSON.stringify(prod).substring(0, 100)}...`, 'blue');
        });
      } else {
        logWarning('Nenhum produto encontrado na collection.');
      }
    }
    
    // Verificar lançamentos se existir
    const lancamentosCollection = Object.values(resultados).find(r => 
      r.nomeEncontrado && (r.nomeEncontrado.includes('lancamento') || 
                          r.nomeEncontrado.includes('movement') || 
                          r.nomeEncontrado.includes('transaction'))
    );
    
    if (lancamentosCollection && lancamentosCollection.encontrada) {
      logInfo(`\n📝 Análise de ${lancamentosCollection.nomeEncontrado}:`);
      
      const lancamentos = await db.collection(lancamentosCollection.nomeEncontrado)
        .find({})
        .limit(5)
        .toArray();
      
      if (lancamentos.length > 0) {
        logSuccess(`${lancamentos.length} lançamentos encontrados (mostrando primeiros 5):`);
        lancamentos.forEach((lanc, idx) => {
          log(`  ${idx + 1}. ${JSON.stringify(lanc).substring(0, 100)}...`, 'blue');
        });
      } else {
        logWarning('Nenhum lançamento encontrado na collection.');
      }
    }
  } catch (error) {
    logError(`Erro ao analisar dados: ${error.message}`);
  }
}

async function verificarIndices(db, resultados) {
  logSection('5. Verificação de Índices');
  
  try {
    for (const [tipo, resultado] of Object.entries(resultados)) {
      if (resultado.encontrada && resultado.nomeEncontrado) {
        const indexes = await db.collection(resultado.nomeEncontrado).indexes();
        
        if (indexes.length > 0) {
          logInfo(`\n📇 Índices em ${resultado.nomeEncontrado}:`);
          indexes.forEach(idx => {
            log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`, 'blue');
            if (idx.unique) log(`    (único)`, 'yellow');
          });
        }
      }
    }
  } catch (error) {
    logError(`Erro ao verificar índices: ${error.message}`);
  }
}

async function gerarRecomendacoes(resultados) {
  logSection('6. Recomendações');
  
  const naoEncontradas = Object.entries(resultados)
    .filter(([_, r]) => !r.encontrada)
    .map(([tipo, _]) => tipo);
  
  if (naoEncontradas.length > 0) {
    logWarning('Collections não encontradas:');
    naoEncontradas.forEach(tipo => {
      log(`  - ${tipo}`, 'yellow');
    });
    logInfo('\n💡 Sugestões:');
    logInfo('  1. Verificar se os nomes das collections estão corretos');
    logInfo('  2. Verificar se os dados foram migrados do Supabase');
    logInfo('  3. Verificar se a aplicação está criando as collections automaticamente');
  } else {
    logSuccess('Todas as collections principais foram encontradas!');
  }
  
  // Verificar se há dados
  const collectionsComDados = Object.values(resultados)
    .filter(r => r.encontrada && r.count > 0);
  
  if (collectionsComDados.length === 0) {
    logWarning('\n⚠️  Nenhuma collection contém dados.');
    logInfo('  Isso pode ser normal se a aplicação ainda não foi usada.');
  } else {
    logSuccess(`\n✅ ${collectionsComDados.length} collections contêm dados.`);
  }
}

async function main() {
  log('\n🔍 Verificação MongoDB - LW StockForge', 'magenta');
  log('='.repeat(60), 'magenta');
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    // 1. Verificar conexão
    const conectado = await verificarConexao(client);
    if (!conectado) {
      logError('\n❌ Não foi possível conectar ao MongoDB. Encerrando verificação.');
      process.exit(1);
    }
    
    // 2. Verificar database
    const db = await verificarDatabase(client);
    
    // 3. Verificar collections
    const resultados = await verificarCollections(db);
    
    // 4. Verificar dados
    await verificarDados(db, resultados);
    
    // 5. Verificar índices
    await verificarIndices(db, resultados);
    
    // 6. Gerar recomendações
    await gerarRecomendacoes(resultados);
    
    logSection('Resumo Final');
    logSuccess('Verificação concluída com sucesso!');
    
    return resultados;
    
  } catch (error) {
    logError(`\n❌ Erro durante a verificação: ${error.message}`);
    logError(`Stack trace: ${error.stack}`);
    process.exit(1);
  } finally {
    await client.close();
    logInfo('\n🔌 Conexão fechada.');
  }
}

// Executar verificação
main()
  .then(() => {
    log('\n✅ Processo finalizado!\n', 'green');
    process.exit(0);
  })
  .catch(error => {
    logError(`\n❌ Erro fatal: ${error.message}`);
    process.exit(1);
  });
