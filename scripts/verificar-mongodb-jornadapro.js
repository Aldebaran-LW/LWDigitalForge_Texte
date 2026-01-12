// ========================================
// Script para Verificar Collections do JornadaPro no MongoDB
// ========================================
// Verifica as collections no database "jornadapro"
// ========================================

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Vercel-Admin-JornadaPro:ewVmHb7gAWngmiRB@jornadapro.gyc7cgi.mongodb.net/?retryWrites=true&w=majority";

async function verificarJornadaPro() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔌 Conectando ao MongoDB...');
    await client.connect();
    console.log('✅ Conectado ao MongoDB com sucesso!\n');

    // Conectar ao database "jornadapro"
    const db = client.db('jornadapro');
    console.log('📊 Database: jornadapro\n');

    // Listar todas as collections
    console.log('📋 Listando collections...');
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log(`Collections encontradas: ${collectionNames.join(', ')}\n`);

    console.log('='.repeat(60));
    console.log('🔍 Verificando Collections do JornadaPro\n');
    console.log('='.repeat(60));

    // Verificar cada collection encontrada
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = db.collection(collectionName);
      const count = await collection.countDocuments();
      
      console.log(`\n📁 ${collectionName}`);
      console.log(`   Documentos: ${count}`);
      
      if (count > 0) {
        // Obter amostra de um documento
        const sample = await collection.findOne({});
        if (sample) {
          console.log(`   Campos: ${Object.keys(sample).join(', ')}`);
          
          // Mostrar alguns campos importantes
          if (sample.nome_empresa) {
            console.log(`   Exemplo nome_empresa: ${sample.nome_empresa}`);
          }
          if (sample.nome) {
            console.log(`   Exemplo nome: ${sample.nome}`);
          }
          if (sample.equipe) {
            console.log(`   Exemplo equipe: ${sample.equipe}`);
          }
          if (sample.data) {
            console.log(`   Exemplo data: ${sample.data}`);
          }
        }
        
        // Mostrar alguns IDs de exemplo
        const samples = await collection.find({}).limit(3).toArray();
        console.log(`   IDs de exemplo:`);
        samples.forEach((doc, idx) => {
          console.log(`      ${idx + 1}. ${doc._id}`);
        });
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n📊 Resumo:\n');

    const totalDocuments = await Promise.all(
      collections.map(async (c) => {
        const count = await db.collection(c.name).countDocuments();
        return count;
      })
    );

    const totalCount = totalDocuments.reduce((sum, count) => sum + count, 0);

    console.log(`Collections: ${collections.length}`);
    console.log(`Total de documentos: ${totalCount}`);
    console.log('\n✅ Verificação concluída!\n');

    // Mapeamento Supabase → MongoDB
    console.log('📋 Mapeamento Supabase → MongoDB:\n');
    console.log('   Supabase (PostgreSQL)        →  MongoDB');
    console.log('   ---------------------------      --------------------');
    console.log('   Empresas                     →  tenants');
    console.log('   Funcionarios                 →  employees');
    console.log('   Apontamentos_Fabrica         →  time_entries (unificado)');
    console.log('   Apontamentos_Viagem          →  time_entries (unificado)');
    console.log('   Feriados                     →  (pode não existir ou nome diferente)');
    console.log('   Relatorios_Mensais           →  (pode ser calculado dinamicamente)');
    console.log('   Logs_Erros                   →  (pode não existir ou nome diferente)\n');

    return {
      database: 'jornadapro',
      collections: collections.map(c => c.name),
      totalDocuments: totalCount
    };

  } catch (error) {
    console.error('❌ Erro:', error.message);
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
verificarJornadaPro()
  .then(resultados => {
    console.log('\n✅ Verificação concluída com sucesso!\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Erro na verificação:', error);
    process.exit(1);
  });
