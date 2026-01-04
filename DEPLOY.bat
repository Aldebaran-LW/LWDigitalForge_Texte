@echo off
chcp 65001 >nul
echo ========================================
echo Deploy da Edge Function check-subscription
echo ========================================
echo.

REM Configurar o token
set SUPABASE_ACCESS_TOKEN=sbp_17044a0c34e1a5bb6157319ea867e094c6ae0a12

echo Token configurado.
echo.

REM Fazer link do projeto (ignorar erro do .env)
echo Fazendo link do projeto...
call npx supabase link --project-ref wwwwyuwighdehmvnolrl 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Tentando novamente sem .env...
    set SUPABASE_IGNORE_ENV=true
    call npx supabase link --project-ref wwwwyuwighdehmvnolrl
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo AVISO: Erro ao fazer link, mas continuando...
    )
)

echo.
echo Fazendo deploy da funcao...
call npx supabase functions deploy check-subscription
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERRO: Falha no deploy.
    echo.
    echo Tentando com variavel de ambiente...
    set SUPABASE_ACCESS_TOKEN=sbp_17044a0c34e1a5bb6157319ea867e094c6ae0a12
    call npx supabase functions deploy check-subscription --project-ref wwwwyuwighdehmvnolrl
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ERRO: Falha no deploy. Verifique os logs acima.
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo SUCESSO: Deploy realizado com sucesso!
echo ========================================
echo.
echo URL da funcao:
echo https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription
echo.
echo Proximo passo: Testar a funcao
echo Execute: npm run test:check-subscription:prod
echo.
pause
