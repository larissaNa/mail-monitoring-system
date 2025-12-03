# Sistema de Recebimento e Classificação de E-mails

### Supabase • TypeScript • React 

Este projeto implementa um sistema completo para **receber e-mails automaticamente**, salvar no banco de dados Supabase e exibi-los em uma interface desenvolvida em **React + TypeScript**.
A integração é feita por meio de uma **Supabase Edge Function** que recebe webhooks do **Resend Inbound Email**.

---

# Tecnologias Utilizadas

* **React + TypeScript** (frontend)
* **Supabase**

  * Edge Functions
  * PostgreSQL
  * Row Level Security
  * Supabase CLI
* **Resend Inbound Email** (webhook de e-mails)
* **Node / TS**
* **Scoop** (instalação simples no Windows)

---

# Instalação do Ambiente

## 1. Instalar Scoop (Windows)

No PowerShell do Vscode, execute:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
```

## 2. Instalar Supabase CLI

```powershell
scoop install supabase
```

## 3. Login no Supabase

```bash
supabase login
```

---

# 📁 Estrutura do Projeto

```
supabase/
 ├─ functions/
 │   └─ inbound-email/
 │        ├─ index.ts         # Edge Function principal
 │        ├─ README.md        # Documentação da Function
 │        └─ test-example.sh  # Script de teste
 ├─ migrations/
 │   └─ 20251203000000_inbound_email_setup.sql
src/
 ├─ services/
 │   └─ emailService.ts       # Salvamento de e-mails inbound
 ├─ types/
 │   └─ resend.ts             # Tipagem do payload do Resend
RESEND_INBOUND_SETUP.md       # Passo a passo da integração
```

---

# Como Funciona o Sistema

1. Um e-mail é enviado para `exemplo@gmail.com`
2. O Resend recebe o conteúdo e dispara um **webhook**
3. A Edge Function `/inbound-email` recebe o webhook
4. Valida assinatura e campos obrigatórios
5. Insere o e-mail na tabela `emails` usando Service Role
6. O frontend exibe automaticamente nas telas:

   * Pendentes
   * Lista de e-mails
   * Estatísticas do Dashboard

---

# Edge Function – inbound-email

Local:

```
supabase/functions/inbound-email/index.ts
```

Ela é responsável por:

✔ Receber o webhook do Resend
✔ Validar a assinatura (`resend-signature`)
✔ Validar campos obrigatórios
✔ Processar e salvar o e-mail no banco
✔ Tratar erros e gerar logs

---

# 🔧 Variáveis de Ambiente Necessárias

| Variável                    | Descrição                             |
| --------------------------- | ------------------------------------- |
| `RESEND_WEBHOOK_SECRET`     | Secret configurado no Resend          |
| `SUPABASE_URL`              | Automático em Edge Functions          |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role do Supabase (automático) |

Configurar secret:

```bash
supabase secrets set RESEND_WEBHOOK_SECRET=sua_chave_secreta
```

---

# Deploy da Edge Function

```bash
supabase functions deploy inbound-email
```

Ver logs:

```bash
supabase functions logs inbound-email --tail
```

Rodar local:

```bash
supabase functions serve inbound-email
```

---

# Autores

Projeto desenvolvido por **Larissa Souza** e **Maria Isabelly**
