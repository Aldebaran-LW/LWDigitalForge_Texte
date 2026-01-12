// ========================================
// Script para Verificar Dados no MongoDB
// ========================================
// Verifica se todos os dados foram migrados do Supabase para MongoDB
// ========================================

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Vercel-Admin-JornadaPro:ewVmHb7gAWngmiRB@jornadapro.gyc7cgi.mongodb.net/?retryWrites=true&w=majority";

// Nomes das collections esperadas no MongoDB (equivalente às tabelas do Supabase)
const COLLECTIONS = {
  apontamentosFabrica: 'apontamentos_fabrica', // ou 'apontamentosFabrica'
  apontamentosViagem: 'apontamentos_viagem', // ou 'apontamentosViagem'
  empresas: 'empresas',
  funcionarios: 'funcionarios',
  feriados: 'feriados',
  relatoriosMensais: 'relatorios_mensais', // ou 'relatoriosMensais'
  logsErros: 'logs_erros' // ou 'logsErros'
};

async function verificarMongoDB() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔌 Conectando ao MongoDB...');
    await client.connect();
    console.log('✅ Conectado ao MongoDB com sucesso!\n');

    const db = client.db(); // Usa o banco padrão da URI
    const dbName = db.databaseName;
    console.log(`📊 Banco de dados: ${dbName}\n`);

    // Listar todas as collections
    console.log('📋 Listando collections disponíveis...');
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log(`Collections encontradas: ${collectionNames.join(', ')}\n`);

    // Verificar cada collection esperada
    console.log('🔍 Verificando collections do JornadaPro...\n');
    console.log('='.repeat(60));

    const resultados = {};

    for (const [key, collectionName] of Object.entries(COLLECTIONS)) {
      // Tentar diferentes variações do nome
      const variacoes = [
        collectionName,
        collectionName.toLowerCase(),
        collectionName.replace(/_/g, ''),
        key
      ];

      let encontrada = false;
      let count = 0;
      let nomeEncontrado = null;

      for (const nome of variacoes) {
        if (collectionNames.includes(nome)) {
          encontrada = true;
          nomeEncontrado = nome;
          count = await db.collection(nome).countDocuments();
          break;
        }
      }

      resultados[key] = {
        encontrada,
        nomeEncontrado,
        count,
        nomeEsperado: collectionName
      };

      const status = encontrada ? '✅' : '❌';
      const nomeDisplay = nomeEncontrado || 'NÃO ENCONTRADA';
      console.log(`${status} ${key.padEnd(25)} | ${nomeDisplay.padEnd(25)} | ${count} documentos`);
    }

    console.log('='.repeat(60));
    console.log('\n📊 Resumo:\n');

    const encontradas = Object.values(resultados).filter(r => r.encontrada).length;
    const total = Object.keys(resultados).length;

    console.log(`Collections encontradas: ${encontradas}/${total}`);
    console.log(`Total de documentos: ${Object.values(resultados).reduce((sum, r) => sum + r.count, 0)}\n`);

    // Verificar algumas amostras de dados
    console.log('🔍 Amostras de dados:\n');

    if (resultados.empresas.encontrada) {
      const empresas = await db.collection(resultados.empresas.nomeEncontrado).find({}).limit(3).toArray();
      console.log(`📁 ${resultados.empresas.nomeEncontrado} (primeiros 3 documentos):`);
      empresas.forEach((empresa, idx) => {
        console.log(`  ${idx + 1}. ID: ${empresa._id}, Nome: ${empresa.nome_empresa || empresa.nomeEmpresa || 'N/A'}`);
      });
      console.log();
    }

    if (resultados.funcionarios.encontrada) {
      const funcionarios = await db.collection(resultados.funcionarios.nomeEncontrado).find({}).limit(3).toArray();
      console.log(`📁 ${resultados.funcionarios.nomeEncontrado} (primeiros 3 documentos):`);
      funcionarios.forEach((func, idx) => {
        console.log(`  ${idx + 1}. ID: ${func._id}, Nome: ${func.nome || 'N/A'}, Equipe: ${func.equipe || 'N/A'}`);
      });
      console.log();
    }

    // Verificar índices (se houver)
    if (resultados.empresas.encontrada) {
      const indexes = await db.collection(resultados.empresas.nomeEncontrado).indexes();
      if (indexes.length > 0) {
        console.log(`📇 Índices em ${resultados.empresas.nomeEncontrado}:`);
        indexes.forEach(idx => {
          console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`);
        });
        console.log();
      }
    }

    // Recomendações
    console.log('💡 Recomendações:\n');
    
    const naoEncontradas = Object.entries(resultados)
      .filter(([_, r]) => !r.encontrada)
      .map(([key, r]) => `${key} (esperado: ${r.nomeEsperado})`);

    if (naoEncontradas.length > 0) {
      console.log('⚠️  Collections não encontradas:');
      naoEncontradas.forEach(nome => console.log(`  - ${nome}`));
      console.log('\n💡 Verifique se os nomes das collections estão corretos.');
      console.log('   Os nomes podem variar (snake_case vs camelCase).\n');
    } else {
      console.log('✅ Todas as collections esperadas foram encontradas!\n');
    }

    // Verificar estrutura de um documento de exemplo
    if (resultados.apontamentosFabrica.encontrada) {
      const sample = await db.collection(resultados.apontamentosFabrica.nomeEncontrado).findOne({});
      if (sample) {
        console.log('📄 Estrutura de exemplo (apontamentos_fabrica):');
        console.log(`   Campos: ${Object.keys(sample).join(', ')}\n`);
      }
    }

    return resultados;

  } catch (error) {
    console.error('❌ Erro ao verificar MongoDB:', error.message);
    if (error.message.includes('authentication failed')) {
      console.error('\n💡 Verifique se a URI do MongoDB está correta.');
      console.error('   Certifique-se de que as credenciais estão válidas.\n');
    }
    throw error;
  } finally {
    await client.close();
    console.log('🔌 Conexão fechada.');
  }
}

// Executar verificação
verificarMongoDB()
  .then(resultados => {
    console.log('\n✅ Verificação concluída!\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Erro na verificação:', error);
    process.exit(1);
  });
