#!/usr/bin/env python3
"""
Script para verificar se o MongoDB está sincronizado com o Supabase
e forçar sincronização manual se necessário
"""

import os
from pymongo import MongoClient
from supabase import create_client
from datetime import datetime, timezone

# ==================== CONFIGURAÇÕES ====================
SUPABASE_URL = "https://wwwwyuwighdehmvnolrl.supabase.co"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzM0MjcwOCwiZXhwIjoyMDc4NzAyNzA4fQ.TwCzu93jnFLN-t26xHOQp4cEdCnzRtqtrc0Lzm4mZxs"

MONGODB_URI = "mongodb+srv://Vercel-Admin-JornadaPro:ewVmHb7gAWngmiRB@jornadapro.gyc7cgi.mongodb.net/?retryWrites=true&w=majority"
MONGODB_DB_NAME = "jornadapro_db"

JORNADAPRO_APP_ID = "e8ff7872-dedb-405c-bf8a-f7901ac4b432"

# =======================================================

def calculate_access_status(user_id, app_id, supabase_client):
    """Calcula o status de acesso de um usuário"""
    has_access = False
    access_type = None
    
    # 1. Check for LIFETIME purchases
    lifetime_purchase = supabase_client.from_('user_purchases').select('*').eq('user_id', user_id).eq('app_id', app_id).eq('purchase_type', 'LIFETIME').eq('status', 'APPROVED').maybe_single().execute()
    if lifetime_purchase.data:
        return True, 'LIFETIME'
    
    # 2. Check for active MONTHLY/ANNUAL purchases
    active_subscription = supabase_client.from_('user_purchases').select('*').eq('user_id', user_id).eq('app_id', app_id).eq('status', 'APPROVED').in_('purchase_type', ['MONTHLY', 'ANNUAL']).gt('expires_at', datetime.now(timezone.utc).isoformat()).maybe_single().execute()
    if active_subscription.data:
        return True, active_subscription.data['purchase_type']
    
    # 3. Check for active trials
    active_trial = supabase_client.from_('user_trials').select('*').eq('user_id', user_id).eq('app_id', app_id).eq('is_active', True).gt('expires_at', datetime.now(timezone.utc).isoformat()).maybe_single().execute()
    if active_trial.data:
        return True, 'TRIAL'
    
    return has_access, access_type


def main():
    print("=" * 80)
    print("🔍 VERIFICAÇÃO DE SINCRONIZAÇÃO SUPABASE → MONGODB")
    print("=" * 80)
    print()
    
    # Conectar ao Supabase
    print("📡 Conectando ao Supabase...")
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    print("✅ Conectado ao Supabase!")
    print()
    
    # Conectar ao MongoDB
    print("📡 Conectando ao MongoDB...")
    mongo_client = MongoClient(MONGODB_URI)
    db = mongo_client[MONGODB_DB_NAME]
    collection = db['user_access']
    print("✅ Conectado ao MongoDB!")
    print()
    
    # Buscar todos os usuários do Supabase
    print("🔍 Buscando usuários no Supabase...")
    profiles_response = supabase.from_('profiles').select('id, email, full_name, role').execute()
    users = profiles_response.data
    print(f"✅ Encontrados {len(users)} usuários no Supabase")
    print()
    
    print("=" * 80)
    print("📊 VERIFICAÇÃO POR USUÁRIO:")
    print("=" * 80)
    print()
    
    synced_count = 0
    not_synced_count = 0
    updated_count = 0
    
    for user in users:
        user_id = user['id']
        email = user['email']
        full_name = user.get('full_name', 'N/A')
        role = user['role']
        
        print(f"👤 {email} ({role})")
        print(f"   ID: {user_id}")
        
        # Calcular acesso no Supabase
        has_access, access_type = calculate_access_status(user_id, JORNADAPRO_APP_ID, supabase)
        
        if has_access:
            print(f"   Supabase: ✅ TEM ACESSO ({access_type})")
        else:
            print(f"   Supabase: ❌ SEM ACESSO")
        
        # Verificar MongoDB
        mongo_record = collection.find_one({"user_id": user_id, "app_id": JORNADAPRO_APP_ID})
        
        if mongo_record:
            mongo_has_access = mongo_record.get('has_access', False)
            mongo_access_type = mongo_record.get('access_type', 'N/A')
            
            if mongo_has_access:
                print(f"   MongoDB:  ✅ TEM ACESSO ({mongo_access_type})")
            else:
                print(f"   MongoDB:  ❌ SEM ACESSO")
            
            # Verificar se está sincronizado
            if has_access == mongo_has_access and access_type == mongo_access_type:
                print(f"   Status:   ✅ SINCRONIZADO")
                synced_count += 1
            else:
                print(f"   Status:   ⚠️  DESINCRONIZADO - ATUALIZANDO...")
                
                # Atualizar MongoDB
                collection.update_one(
                    {"user_id": user_id, "app_id": JORNADAPRO_APP_ID},
                    {
                        "$set": {
                            "has_access": has_access,
                            "access_type": access_type,
                            "last_updated": datetime.now(timezone.utc)
                        }
                    }
                )
                print(f"   Status:   ✅ ATUALIZADO!")
                updated_count += 1
        else:
            print(f"   MongoDB:  ❌ REGISTRO NÃO EXISTE")
            
            if has_access:
                print(f"   Status:   ⚠️  CRIANDO REGISTRO NO MONGODB...")
                
                # Criar registro no MongoDB
                collection.insert_one({
                    "user_id": user_id,
                    "app_id": JORNADAPRO_APP_ID,
                    "has_access": has_access,
                    "access_type": access_type,
                    "last_updated": datetime.now(timezone.utc)
                })
                print(f"   Status:   ✅ CRIADO!")
                updated_count += 1
            else:
                print(f"   Status:   ℹ️  Usuário sem acesso (não precisa de registro)")
                not_synced_count += 1
        
        print()
    
    print("=" * 80)
    print("📊 RESUMO:")
    print("=" * 80)
    print(f"✅ Sincronizados:     {synced_count}")
    print(f"🔄 Atualizados/Criados: {updated_count}")
    print(f"❌ Sem acesso:        {not_synced_count}")
    print(f"📊 Total:             {len(users)}")
    print()
    
    if updated_count > 0:
        print("🎉 SINCRONIZAÇÃO COMPLETA!")
        print("   Tente acessar a aplicação novamente.")
    elif synced_count == len(users):
        print("✅ TUDO JÁ ESTAVA SINCRONIZADO!")
        print("   Se ainda não consegue acessar, o problema é outra coisa.")
    
    print()
    print("=" * 80)
    
    mongo_client.close()


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"❌ ERRO: {e}")
        import traceback
        traceback.print_exc()
