# 📧 Configuração do Recebimento Automático de E-mails via Resend Inbound

Este guia explica como configurar o recebimento automático de e-mails usando Resend Inbound Email + Webhook → Supabase Edge Function.

## 🎯 Visão Geral

Quando um colaborador enviar um e-mail com cópia para `meusistema@inbound.resend.dev` (ou o endereço inbound configurado), o sistema receberá automaticamente esse e-mail e o armazenará no banco de dados.

## 📋 Pré-requisitos

1. Conta no [Resend](https://resend.com)
2. Projeto Supabase configurado
3. Supabase CLI instalado (para deploy da Edge Function)

## 🔧 Passo 1: Configurar Resend Inbound Email

### 1.1 Criar Domínio no Resend

1. Acesse o [Dashboard do Resend](https://resend.com/domains)
2. Clique em **"Add Domain"**
3. Adicione seu domínio (ex: `inbound.resend.dev` ou seu próprio domínio)
4. Configure os registros DNS conforme instruções do Resend
5. Aguarde a verificação do domínio

### 1.2 Criar Endereço Inbound

1. No dashboard do Resend, vá em **"Inbound"** → **"Add Inbound"**
2. Configure:
   - **Domain**: Selecione o domínio verificado
   - **Inbound Address**: Exemplo: `meusistema@inbound.resend.dev`
   - **Webhook URL**: `https://[SEU_PROJETO].supabase.co/functions/v1/inbound-email`
   
   **Exemplo de URL completa:**
   ```
   https://abcdefghijklmnop.supabase.co/functions/v1/inbound-email
   ```

3. **Webhook Secret** (opcional mas recomendado):
   - Gere uma string secreta (ex: use um gerador de senhas)
   - Anote este valor - você precisará configurá-lo no Supabase

### 1.3 Configurar Webhook Secret no Resend

1. No painel do Inbound, adicione o **Webhook Secret**
2. Este valor será usado no header `resend-signature` nas requisições

## 🔧 Passo 2: Deploy da Edge Function no Supabase

### 2.1 Instalar Supabase CLI (se ainda não tiver)

```bash
npm install -g supabase
```

### 2.2 Fazer Login no Supabase

```bash
supabase login
```

### 2.3 Linkar o Projeto

```bash
supabase link --project-ref [SEU_PROJECT_REF]
```

O `project-ref` pode ser encontrado na URL do seu projeto Supabase:
- URL: `https://abcdefghijklmnop.supabase.co`
- Project Ref: `abcdefghijklmnop`

### 2.4 Configurar Variáveis de Ambiente

Configure as variáveis de ambiente da Edge Function:

```bash
supabase secrets set RESEND_WEBHOOK_SECRET=sua_chave_secreta_aqui
```

**Nota:** Se você não configurou um webhook secret no Resend, pode deixar esta variável vazia ou não configurá-la. A validação será ignorada se a variável não existir.

### 2.5 Deploy da Function

```bash
supabase functions deploy inbound-email
```

### 2.6 Verificar Deploy

A função estará disponível em:
```
https://[SEU_PROJETO].supabase.co/functions/v1/inbound-email
```

## 🔧 Passo 3: Aplicar Migration no Banco de Dados

Execute a migration para garantir que a tabela está configurada corretamente:

```bash
supabase db push
```

Ou via SQL Editor no Supabase Dashboard:
1. Acesse o SQL Editor
2. Execute o conteúdo do arquivo: `supabase/migrations/20251203000000_inbound_email_setup.sql`

## 🧪 Passo 4: Testar a Integração

### 4.1 Teste Manual via cURL

Você pode testar a Edge Function diretamente:

```bash
curl -X POST https://[SEU_PROJETO].supabase.co/functions/v1/inbound-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [SUPABASE_ANON_KEY]" \
  -H "resend-signature: sua_chave_secreta_aqui" \
  -d '{
    "from": "teste@exemplo.com",
    "to": "meusistema@inbound.resend.dev",
    "subject": "E-mail de Teste",
    "text": "Este é um e-mail de teste",
    "html": "<p>Este é um e-mail de teste</p>",
    "date": "2025-12-06T12:21:00Z"
  }'
```

### 4.2 Teste Real

1. Envie um e-mail real para o endereço inbound configurado
2. Verifique os logs da Edge Function:
   ```bash
   supabase functions logs inbound-email
   ```
3. Verifique se o e-mail apareceu na tabela `emails` no Supabase

## 📊 Estrutura do Payload Recebido

A Edge Function espera receber um JSON no seguinte formato:

```json
{
  "from": "joao@empresa.com",
  "to": "meusistema@inbound.resend.dev",
  "subject": "Proposta",
  "text": "conteudo do e-mail",
  "html": "<p>conteudo do e-mail</p>",
  "date": "2025-12-06T12:21:00Z"
}
```

### Campos Obrigatórios:
- `from`: E-mail do remetente
- `to`: E-mail do destinatário (endereço inbound)
- `subject`: Assunto do e-mail
- `date`: Data/hora do e-mail (ISO 8601)

### Campos Opcionais:
- `text`: Versão texto do e-mail
- `html`: Versão HTML do e-mail
- `headers`: Headers adicionais do e-mail

**Nota:** O sistema prioriza `html` sobre `text` para o campo `corpo` no banco de dados.

## 🔒 Segurança

### Validação de Webhook Secret

A Edge Function valida o header `resend-signature` se a variável de ambiente `RESEND_WEBHOOK_SECRET` estiver configurada.

**Importante:** Em produção, sempre configure um webhook secret forte e mantenha-o seguro.

### Service Role Key

A Edge Function usa a `SUPABASE_SERVICE_ROLE_KEY` para inserir e-mails no banco. Esta chave:
- Bypassa RLS (Row Level Security)
- Tem acesso total ao banco de dados
- **NUNCA** deve ser exposta no frontend

## 📝 Estrutura da Tabela `emails`

A tabela `emails` possui os seguintes campos:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | ID único (gerado automaticamente) |
| `remetente` | TEXT | E-mail do remetente |
| `destinatario` | TEXT | E-mail do destinatário |
| `assunto` | TEXT | Assunto do e-mail |
| `corpo` | TEXT | Corpo do e-mail (HTML ou texto) |
| `data_envio` | TIMESTAMPTZ | Data/hora de envio |
| `estado` | TEXT | Estado classificado (NULL inicialmente) |
| `municipio` | TEXT | Município classificado (NULL inicialmente) |
| `classificado` | BOOLEAN | Se o e-mail foi classificado (default: false) |
| `colaborador_id` | UUID | ID do colaborador (NULL para e-mails inbound) |
| `created_at` | TIMESTAMPTZ | Data de criação (automático) |
| `updated_at` | TIMESTAMPTZ | Data de atualização (automático) |

## 🐛 Troubleshooting

### E-mail não está sendo recebido

1. **Verifique os logs da Edge Function:**
   ```bash
   supabase functions logs inbound-email --tail
   ```

2. **Verifique a configuração do webhook no Resend:**
   - URL está correta?
   - Webhook secret está configurado?

3. **Verifique as variáveis de ambiente:**
   ```bash
   supabase secrets list
   ```

### Erro 401 (Unauthorized)

- Verifique se o `resend-signature` header está correto
- Verifique se `RESEND_WEBHOOK_SECRET` está configurado corretamente

### Erro 400 (Bad Request)

- Verifique se todos os campos obrigatórios estão presentes no payload
- Verifique o formato da data (deve ser ISO 8601)

### E-mail não aparece no banco de dados

1. Verifique os logs da Edge Function para erros
2. Verifique as políticas RLS da tabela `emails`
3. Verifique se a `SUPABASE_SERVICE_ROLE_KEY` está configurada corretamente

## 📚 Recursos Adicionais

- [Documentação Resend Inbound](https://resend.com/docs/dashboard/inbound)
- [Documentação Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Documentação Supabase CLI](https://supabase.com/docs/reference/cli)

## ✅ Checklist de Configuração

- [ ] Domínio configurado no Resend
- [ ] Endereço inbound criado
- [ ] Webhook URL configurada corretamente
- [ ] Webhook secret configurado (opcional mas recomendado)
- [ ] Edge Function deployada no Supabase
- [ ] Variável `RESEND_WEBHOOK_SECRET` configurada (se usando secret)
- [ ] Migration aplicada no banco de dados
- [ ] Teste realizado com sucesso
- [ ] E-mails aparecendo na tela de Pendentes

## 🎉 Pronto!

Após seguir todos os passos, o sistema estará configurado para receber e-mails automaticamente. Todos os e-mails recebidos via inbound aparecerão:

- Na **Tela 2: Pendentes** (com `classificado = false`)
- No **Dashboard** (nas estatísticas)
- Na **Lista de E-mails** (com os filtros funcionando)

