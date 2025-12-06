#!/bin/bash

# Script para verificar se a configuração da branch do Supabase está correta

echo "🔍 Verificando configuração da branch do Supabase..."
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI não encontrado${NC}"
    echo "Instale com: npm install -g supabase"
    exit 1
fi

echo -e "${GREEN}✅ Supabase CLI encontrado${NC}"

# Verificar se está logado
if ! supabase projects list &> /dev/null; then
    echo -e "${YELLOW}⚠️ Não está logado no Supabase CLI${NC}"
    echo "Execute: supabase login"
    exit 1
fi

echo -e "${GREEN}✅ Logado no Supabase CLI${NC}"

# Verificar variáveis de ambiente
PROJECT_ID="wwwwyuwighdehmvnolrl"
BRANCH_NAME="feat-supabase-registered-apps-integration"

echo ""
echo "📋 Verificando branches do projeto: $PROJECT_ID"
echo ""

# Listar branches
BRANCHES=$(supabase branches list --project-ref $PROJECT_ID 2>/dev/null)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Conseguiu listar branches${NC}"
    echo ""
    echo "$BRANCHES"
    echo ""
    
    # Verificar se a branch existe
    if echo "$BRANCHES" | grep -q "$BRANCH_NAME"; then
        echo -e "${GREEN}✅ Branch '$BRANCH_NAME' encontrada!${NC}"
        
        # Tentar obter ID da branch
        BRANCH_ID=$(echo "$BRANCHES" | grep "$BRANCH_NAME" | awk '{print $1}' || echo "")
        if [ -n "$BRANCH_ID" ]; then
            echo -e "${GREEN}   Branch ID: $BRANCH_ID${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️ Branch '$BRANCH_NAME' não encontrada${NC}"
        echo "   Você precisa criar a branch no dashboard do Supabase"
    fi
else
    echo -e "${RED}❌ Erro ao listar branches${NC}"
    echo "   Verifique se o PROJECT_ID está correto e se você tem permissões"
fi

echo ""
echo "📋 Verificando secrets do GitHub (localmente):"
echo ""

# Verificar se .env.local existe (para desenvolvimento local)
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ Arquivo .env.local encontrado${NC}"
    
    if grep -q "VITE_SUPABASE_URL_DEV" .env.local; then
        echo -e "${GREEN}✅ VITE_SUPABASE_URL_DEV configurado${NC}"
    else
        echo -e "${YELLOW}⚠️ VITE_SUPABASE_URL_DEV não encontrado em .env.local${NC}"
    fi
    
    if grep -q "VITE_SUPABASE_ANON_KEY_DEV" .env.local; then
        echo -e "${GREEN}✅ VITE_SUPABASE_ANON_KEY_DEV configurado${NC}"
    else
        echo -e "${YELLOW}⚠️ VITE_SUPABASE_ANON_KEY_DEV não encontrado em .env.local${NC}"
    fi
else
    echo -e "${YELLOW}⚠️ Arquivo .env.local não encontrado${NC}"
    echo "   (Isso é normal se você não está desenvolvendo localmente)"
fi

echo ""
echo "📋 Checklist de configuração:"
echo ""
echo "No Supabase Dashboard:"
echo "  [ ] Branch criada: $BRANCH_NAME"
echo "  [ ] Credenciais da branch anotadas (URL e anon key)"
echo ""
echo "No GitHub (Settings → Secrets and variables → Actions):"
echo "  [ ] VITE_SUPABASE_URL_DEV configurado"
echo "  [ ] VITE_SUPABASE_ANON_KEY_DEV configurado"
echo "  [ ] SUPABASE_BRANCH_ID configurado (opcional)"
echo ""
echo "✅ Verificação concluída!"
