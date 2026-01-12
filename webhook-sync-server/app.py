"""
🔄 Sistema Automático de Sincronização de Acesso
Webhook Server para sincronizar Supabase → MongoDB em tempo real
Detecta novos apps automaticamente e mantém sincronização
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from supabase import create_client
from datetime import datetime
import os
import logging
import hashlib
import hmac

# Configuração de Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Inicializar Flask
app = Flask(__name__)
CORS(app)

# Configuração de Ambiente
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
MONGODB_URI = os.environ.get('MONGODB_URI')
WEBHOOK_SECRET = os.environ.get('WEBHOOK_SECRET', 'seu-webhook-secret-aqui')

# Validar variáveis de ambiente
if not all([SUPABASE_URL, SUPABASE_KEY, MONGODB_URI]):
    raise ValueError("❌ Variáveis de ambiente faltando! Configure SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, MONGODB_URI")

# Conectar Supabase
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
logger.info("✅ Conectado ao Supabase")

# Conectar MongoDB
try:
    mongo_client = MongoClient(MONGODB_URI)
    # Testar conexão
    mongo_client.admin.command('ping')
    logger.info("✅ Conectado ao MongoDB")
except Exception as e:
    logger.error(f"❌ Erro ao conectar MongoDB: {e}")
    raise

# Database principal do sistema
sync_db = mongo_client['lwdigitalforge_sync']


def verify_webhook_signature(payload, signature):
    """Verificar assinatura do webhook para segurança"""
    if not signature:
        return False
    
    expected_signature = hmac.new(
        WEBHOOK_SECRET.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(signature, expected_signature)


def get_all_apps():
    """Buscar todos os apps registrados no Supabase"""
    try:
        response = supabase.table('registered_apps').select('*').eq('is_active', True).execute()
        apps = response.data
        logger.info(f"📱 {len(apps)} apps ativos encontrados")
        return apps
    except Exception as e:
        logger.error(f"❌ Erro ao buscar apps: {e}")
        return []


def get_app_database_name(app_id, app_name):
    """Obter nome do database MongoDB para o app"""
    # Mapear apps conhecidos
    app_db_mapping = {
        'jornadapro': 'jornadapro',
        'ponto_diario': 'jornadapro',
        'jornada_pro': 'jornadapro',
    }
    
    # Normalizar nome
    normalized_name = app_name.lower().replace(' ', '_').replace('-', '_')
    
    # Verificar mapeamento
    for key, db_name in app_db_mapping.items():
        if key in normalized_name:
            return db_name
    
    # Fallback: usar nome normalizado
    return normalized_name


def sync_user_access(user_id, app_id=None):
    """
    Sincronizar acesso de um usuário específico
    Se app_id não fornecido, sincroniza TODOS os apps
    """
    try:
        logger.info(f"🔄 Sincronizando acesso para usuário: {user_id}")
        
        # Buscar todos os apps se não especificado
        if not app_id:
            apps = get_all_apps()
            app_ids = [app['id'] for app in apps]
        else:
            app_ids = [app_id]
            apps = get_all_apps()
        
        synced_count = 0
        
        for current_app_id in app_ids:
            # Buscar info do app
            app_info = next((app for app in apps if app['id'] == current_app_id), None)
            if not app_info:
                logger.warning(f"⚠️ App {current_app_id} não encontrado")
                continue
            
            # Verificar acesso via purchases
            purchase_response = supabase.table('user_purchases').select('*').eq('user_id', user_id).eq('app_id', current_app_id).eq('status', 'APPROVED').execute()
            purchases = purchase_response.data
            
            # Verificar acesso via trials
            trial_response = supabase.table('user_trials').select('*').eq('user_id', user_id).eq('app_id', current_app_id).eq('is_active', True).execute()
            trials = trial_response.data
            
            # Determinar se tem acesso
            has_access = False
            access_type = None
            expires_at = None
            
            # Verificar LIFETIME ou assinatura ativa
            for purchase in purchases:
                if purchase['purchase_type'] == 'LIFETIME':
                    has_access = True
                    access_type = 'LIFETIME'
                    break
                elif purchase['purchase_type'] in ['MONTHLY', 'ANNUAL']:
                    if purchase.get('expires_at'):
                        exp_date = datetime.fromisoformat(purchase['expires_at'].replace('Z', '+00:00'))
                        if exp_date > datetime.now(exp_date.tzinfo):
                            has_access = True
                            access_type = purchase['purchase_type']
                            expires_at = purchase['expires_at']
                            break
            
            # Verificar trial ativo
            if not has_access:
                for trial in trials:
                    if trial.get('expires_at'):
                        exp_date = datetime.fromisoformat(trial['expires_at'].replace('Z', '+00:00'))
                        if exp_date > datetime.now(exp_date.tzinfo):
                            has_access = True
                            access_type = 'TRIAL'
                            expires_at = trial['expires_at']
                            break
            
            # Atualizar MongoDB do app
            db_name = get_app_database_name(current_app_id, app_info['name'])
            app_db = mongo_client[db_name]
            
            access_doc = {
                'user_id': user_id,
                'app_id': current_app_id,
                'app_name': app_info['name'],
                'has_access': has_access,
                'access_type': access_type,
                'expires_at': expires_at,
                'updated_at': datetime.utcnow(),
                'synced_from': 'webhook'
            }
            
            app_db.user_access.update_one(
                {'user_id': user_id, 'app_id': current_app_id},
                {'$set': access_doc},
                upsert=True
            )
            
            # Registrar sincronização
            sync_db.sync_log.insert_one({
                'user_id': user_id,
                'app_id': current_app_id,
                'app_name': app_info['name'],
                'database': db_name,
                'has_access': has_access,
                'access_type': access_type,
                'timestamp': datetime.utcnow()
            })
            
            synced_count += 1
            logger.info(f"✅ Sincronizado: {user_id} → {app_info['name']} (acesso: {has_access})")
        
        return {'success': True, 'synced': synced_count}
    
    except Exception as e:
        logger.error(f"❌ Erro ao sincronizar acesso: {e}")
        return {'success': False, 'error': str(e)}


def sync_all_users():
    """Sincronizar TODOS os usuários (full sync)"""
    try:
        logger.info("🔄 Iniciando sincronização completa de TODOS os usuários")
        
        # Buscar todos os usuários com purchases ou trials
        purchases = supabase.table('user_purchases').select('user_id').execute()
        trials = supabase.table('user_trials').select('user_id').execute()
        
        # Coletar IDs únicos
        user_ids = set()
        for p in purchases.data:
            user_ids.add(p['user_id'])
        for t in trials.data:
            user_ids.add(t['user_id'])
        
        logger.info(f"👥 {len(user_ids)} usuários únicos encontrados")
        
        # Sincronizar cada usuário
        synced = 0
        failed = 0
        
        for user_id in user_ids:
            result = sync_user_access(user_id)
            if result['success']:
                synced += 1
            else:
                failed += 1
        
        logger.info(f"✅ Sincronização completa: {synced} OK, {failed} falhas")
        
        return {
            'success': True,
            'total_users': len(user_ids),
            'synced': synced,
            'failed': failed
        }
    
    except Exception as e:
        logger.error(f"❌ Erro na sincronização completa: {e}")
        return {'success': False, 'error': str(e)}


@app.route('/')
def home():
    """Health check"""
    return jsonify({
        'status': 'online',
        'service': 'LWDigitalForge Sync Server',
        'version': '2.0',
        'timestamp': datetime.utcnow().isoformat()
    })


@app.route('/health')
def health():
    """Health check detalhado"""
    try:
        # Testar Supabase
        supabase.table('registered_apps').select('id').limit(1).execute()
        supabase_ok = True
    except:
        supabase_ok = False
    
    try:
        # Testar MongoDB
        mongo_client.admin.command('ping')
        mongodb_ok = True
    except:
        mongodb_ok = False
    
    return jsonify({
        'status': 'healthy' if (supabase_ok and mongodb_ok) else 'degraded',
        'supabase': 'connected' if supabase_ok else 'disconnected',
        'mongodb': 'connected' if mongodb_ok else 'disconnected',
        'timestamp': datetime.utcnow().isoformat()
    })


@app.route('/webhook/user-purchase', methods=['POST'])
def webhook_user_purchase():
    """
    Webhook para user_purchases
    Recebe notificação do Supabase quando há INSERT/UPDATE
    """
    try:
        data = request.json
        logger.info(f"📥 Webhook recebido: user_purchase")
        
        # Extrair dados
        record = data.get('record', {})
        user_id = record.get('user_id')
        app_id = record.get('app_id')
        
        if not user_id or not app_id:
            return jsonify({'error': 'user_id ou app_id faltando'}), 400
        
        # Sincronizar
        result = sync_user_access(user_id, app_id)
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"❌ Erro no webhook user_purchase: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/webhook/user-trial', methods=['POST'])
def webhook_user_trial():
    """
    Webhook para user_trials
    Recebe notificação do Supabase quando há INSERT/UPDATE
    """
    try:
        data = request.json
        logger.info(f"📥 Webhook recebido: user_trial")
        
        # Extrair dados
        record = data.get('record', {})
        user_id = record.get('user_id')
        app_id = record.get('app_id')
        
        if not user_id or not app_id:
            return jsonify({'error': 'user_id ou app_id faltando'}), 400
        
        # Sincronizar
        result = sync_user_access(user_id, app_id)
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"❌ Erro no webhook user_trial: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/sync/user/<user_id>', methods=['POST'])
def sync_user_endpoint(user_id):
    """Endpoint para sincronizar um usuário específico (pode ser chamado do n8n)"""
    try:
        app_id = request.json.get('app_id') if request.json else None
        result = sync_user_access(user_id, app_id)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/sync/full', methods=['POST'])
def sync_full_endpoint():
    """Endpoint para sincronização completa (pode ser chamado do n8n)"""
    try:
        # Verificar autenticação básica
        auth = request.headers.get('Authorization')
        if not auth or not auth.startswith('Bearer '):
            return jsonify({'error': 'Unauthorized'}), 401
        
        token = auth.split('Bearer ')[1]
        if token != os.environ.get('SYNC_API_KEY', 'default-sync-key'):
            return jsonify({'error': 'Invalid token'}), 401
        
        result = sync_all_users()
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/apps', methods=['GET'])
def list_apps():
    """Listar todos os apps registrados"""
    try:
        apps = get_all_apps()
        return jsonify({
            'success': True,
            'count': len(apps),
            'apps': apps
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/logs', methods=['GET'])
def get_logs():
    """Ver últimos logs de sincronização"""
    try:
        limit = int(request.args.get('limit', 50))
        logs = list(sync_db.sync_log.find().sort('timestamp', -1).limit(limit))
        
        # Converter ObjectId para string
        for log in logs:
            log['_id'] = str(log['_id'])
            log['timestamp'] = log['timestamp'].isoformat()
        
        return jsonify({
            'success': True,
            'count': len(logs),
            'logs': logs
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    logger.info(f"🚀 Servidor iniciando na porta {port}")
    app.run(host='0.0.0.0', port=port)
