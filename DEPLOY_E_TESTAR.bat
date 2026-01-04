@echo off
chcp 65001 >nul
echo ========================================
echo Deploy e Teste da Edge Function
echo check-subscription
echo ========================================
echo.

REM Configurar o token
set SUPABASE_ACCESS_TOKEN=sbp_17044a0c34e1a5bb6157319ea867e094c6ae0a12

echo [1/3] Token configurado.
echo.

REM Fazer link do projeto
echo [2/3] Fazendo link do projeto...
call npx supabase link --project-ref wwwwyuwighdehmvnolrl
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERRO: Falha ao fazer link do projeto.
    pause
    exit /b 1
)

echo Link concluido!
echo.

REM Fazer deploy
echo [3/3] Fazendo deploy da funcao...
call npx supabase functions deploy check-subscription
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERRO: Falha no deploy.
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCESSO: Deploy realizado!
echo ========================================
echo.
echo URL da funcao:
echo https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription
echo.
echo ========================================
echo Iniciando testes...
echo ========================================
echo.

REM Executar testes
call npm run test:check-subscription:prod

echo.
echo ========================================
echo Processo concluido!
echo ========================================
echo.
pause

