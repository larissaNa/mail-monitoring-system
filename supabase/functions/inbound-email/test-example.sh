#!/bin/bash

# Script de exemplo para testar a Edge Function inbound-email
# Substitua as variáveis abaixo pelos valores do seu projeto

SUPABASE_URL="https://seu-projeto.supabase.co"
SUPABASE_ANON_KEY="sua-anon-key-aqui"
RESEND_SIGNATURE="seu-webhook-secret-aqui"

curl -X POST "${SUPABASE_URL}/functions/v1/inbound-email" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "resend-signature: ${RESEND_SIGNATURE}" \
  -d '{
    "from": "teste@exemplo.com",
    "to": "meusistema@inbound.resend.dev",
    "subject": "E-mail de Teste - Recebimento Automático",
    "text": "Este é um e-mail de teste para verificar o recebimento automático via Resend Inbound.",
    "html": "<p>Este é um e-mail de teste para verificar o recebimento automático via Resend Inbound.</p>",
    "date": "2025-12-06T12:21:00Z"
  }'

echo ""
echo "Teste concluído. Verifique os logs da função e a tabela emails no Supabase."

