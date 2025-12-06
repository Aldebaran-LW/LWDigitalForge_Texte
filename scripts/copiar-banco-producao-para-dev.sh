#!/bin/bash

# Script para copiar banco de produção para desenvolvimento
# Uso: ./scripts/copiar-banco-producao-para-dev.sh

set -e

echo "🔄 Copiando banco de produção para desenvolvimento..."
echo ""

# IDs dos projetos
PROJECT_ID_PROD="wwwwyuwighdehmvnolrl"
PROJECT_ID_DEV="vedrmtowoosqxzqxgxpb"

# Verificar se Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI não encontrado"
    echo "Instale com: npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI encontrado"
echo ""

# Verificar se está logado
if ! supabase projects list &> /dev/null; then
    echo "⚠️ Não está logado no Supabase CLI"
    echo "Execute: supabase login"
    exit 1
fi

echo "✅ Logado no Supabase CLI"
echo ""

# Criar diretório para dumps
mkdir -p dumps

# Nome do arquivo de dump
DUMP_FILE="dumps/dump_producao_$(date +%Y%m%d_%H%M%S).sql"

echo "📦 Fazendo dump do banco de produção..."
echo "   Projeto: $PROJECT_ID_PROD"
echo ""

# Fazer dump do banco de produção
supabase db dump --project-ref $PROJECT_ID_PROD --schema public > $DUMP_FILE

if [ $? -eq 0 ]; then
    echo "✅ Dump criado: $DUMP_FILE"
    echo ""
    
    echo "📥 Restaurando no banco de desenvolvimento..."
    echo "   Projeto: $PROJECT_ID_DEV"
    echo ""
    
    # Restaurar no banco de desenvolvimento
    # Nota: Isso vai resetar o banco de desenvolvimento!
    read -p "⚠️ Isso vai RESETAR o banco de desenvolvimento. Continuar? (s/N): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        supabase db reset --project-ref $PROJECT_ID_DEV --file $DUMP_FILE
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Banco copiado com sucesso!"
            echo ""
            echo "📋 Próximos passos:"
            echo "   1. Verificar se as tabelas foram criadas"
            echo "   2. Verificar se os dados foram copiados"
            echo "   3. Configurar secrets no GitHub"
        else
            echo "❌ Erro ao restaurar o dump"
            exit 1
        fi
    else
        echo "❌ Operação cancelada"
        exit 0
    fi
else
    echo "❌ Erro ao criar dump"
    exit 1
fi
