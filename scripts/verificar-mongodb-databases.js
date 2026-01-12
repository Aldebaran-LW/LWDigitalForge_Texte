// ========================================
// Script para Listar Databases e Collections no MongoDB
// ========================================
// Verifica quais databases existem e suas collections
// ========================================

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Vercel-Admin-JornadaPro:ewVmHb7gAWngmiRB@jornadapro.gyc7cgi.mongodb.net/?retryWrites=true&w=majority";

async function listarDatabasesECollections() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔌 Conectando ao MongoDB...');
    await client.connect();
    console.log('✅ Conectado ao MongoDB com sucesso!\n');

    // Listar todos os databases
    console.log('📋 Listando todos os databases...\n');
    const adminDb = client.db().admin();
    const { databases } = await adminDb.listDatabases();
    
    console.log(`Total de databases: ${databases.length}\n`);
    console.log('='.repeat(60));

    for (const dbInfo of databases) {
      const dbName = dbInfo.name;
      
      // Ignorar databases do sistema
      if (dbName === 'admin' || dbName === 'local' || dbName === 'config') {
        continue;
      }

      console.log(`\n📊 Database: ${dbName}`);
      console.log(`   Tamanho: ${(dbInfo.sizeOnDisk / 1024 / 1024).toFixed(2)} MB`);
      
      try {
        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();
        
        if (collections.length === 0) {
          console.log(`   Collections: Nenhuma`);
        } else {
          console.log(`   Collections (${collections.length}):`);
          
          for (const collection of collections) {
            const collectionName = collection.name;
            const count = await db.collection(collectionName).countDocuments();
            console.log(`      - ${collectionName.padEnd(30)} | ${count} documentos`);
            
            // Se for a collection "tenants", mostrar amostra
            if (collectionName === 'tenants' && count > 0) {
              const sample = await db.collection(collectionName).findOne({});
              if (sample) {
                console.log(`        Campos: ${Object.keys(sample).join(', ')}`);
              }
            }
          }
        }
      } catch (error) {
        console.log(`   ⚠️  Erro ao listar collections: ${error.message}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n💡 Próximos passos:');
    console.log('   1. Verificar em qual database estão as collections do JornadaPro');
    console.log('   2. Verificar se os nomes das collections estão corretos');
    console.log('   3. Se necessário, ajustar o script de verificação\n');

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

// Executar
listarDatabasesECollections()
  .then(() => {
    console.log('\n✅ Verificação concluída!\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Erro na verificação:', error);
    process.exit(1);
  });
