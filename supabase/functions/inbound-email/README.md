# Inbound Email Edge Function

Esta Edge Function recebe webhooks do Resend Inbound Email e salva os e-mails no banco de dados Supabase.

## Variáveis de Ambiente Necessárias

- `SUPABASE_URL`: URL do projeto Supabase (automático)
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key do Supabase (automático)
- `RESEND_WEBHOOK_SECRET`: Secret para validar webhooks do Resend (opcional)

## Deploy

```bash
supabase functions deploy inbound-email
```

## Configurar Secret

```bash
supabase secrets set RESEND_WEBHOOK_SECRET=sua_chave_secreta
```

## Testar Localmente

```bash
supabase functions serve inbound-email
```

## Logs

```bash
supabase functions logs inbound-email --tail
```

