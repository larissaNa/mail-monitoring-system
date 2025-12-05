
# MailGestor

Este projeto implementa um sistema completo para recebimento automático de e-mails, armazenamento no banco de dados Supabase e exibição em uma interface desenvolvida com React e TypeScript. A integração é realizada por meio de uma Supabase Edge Function que recebe webhooks do Resend Inbound Email.

---

## Tecnologias Utilizadas

- **Frontend**: React + TypeScript + Vite
- **UI Components**: shadcn/ui (Radix UI)
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Integração**: Resend Inbound Email (webhooks)
- **Autenticação**: Supabase Auth
- **State Management**: TanStack React Query
- **Ferramentas adicionais**:
  - Supabase CLI
  - Row Level Security
  - Node.js + TypeScript

---

## Arquitetura do Projeto

O projeto segue uma arquitetura modular baseada em MVVM (Model-View-ViewModel), com separação clara de responsabilidades. A estrutura de diretórios reflete essa organização:

```
src/
├── infrastructure/
│   └── auth/                  # Configurações e utilitários de autenticação
├── lib/                       # Funções auxiliares e bibliotecas internas
├── supabase/                 # Configurações e integração com Supabase
├── model/
│   ├── entities/              # Definição das entidades de domínio
│   ├── repositories/          # Acesso a dados e integração com APIs externas
│   └── services/              # Regras de negócio e orquestração de dados
├── view/                      # Componentes visuais da interface
├── viewmodel/
│   ├── auth/                  # Lógica de autenticação
│   ├── dashboard/             # Lógica da tela de estatísticas
│   ├── email/                 # Lógica da tela de e-mails
│   ├── layout/                # Lógica de layout e estrutura visual
│   ├── sidebar/               # Lógica da navegação lateral
│   └── useNotFoundViewModel.ts # ViewModel para página de erro 404
```

Essa organização facilita a escalabilidade, testabilidade e manutenção do sistema, promovendo separação entre interface, lógica de apresentação, regras de negócio e persistência de dados.

---

## Fluxo de Dados MVVM

```
VIEW (Componentes)
    ↓
VIEWMODEL (useXxxViewModel)
    ↓
SERVICE (EmailService, LocationService)
    ↓
REPOSITORY (EmailRepository, LocationRepository)
    ↓
API/DATABASE (Supabase, IBGE)
```

---

## Preparação do Ambiente

Instale as dependências:

```bash
npm install
```

### 1. Instalar Scoop (Windows)

No PowerShell do VSCode, execute:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
```

### 2. Instalar Supabase CLI

```powershell
scoop install supabase
```

### 3. Login no Supabase

```bash
supabase login
```

Execute o projeto:

```bash
npm run dev
```

---

## Como Funciona o Sistema

1. Um e-mail é enviado para `exemplo@gmail.com`
2. O Resend recebe o conteúdo e dispara um webhook
3. A Edge Function `/inbound-email` recebe o webhook
4. Valida assinatura e campos obrigatórios
5. Insere o e-mail na tabela `emails` usando Service Role
6. O frontend exibe automaticamente nas telas:
   - Pendentes
   - Lista de e-mails
   - Estatísticas do Dashboard

---

## Documentação dos Services com JSDoc

Este projeto utiliza JSDoc para gerar documentação automática dos serviços.

### Passo a passo

1. Transpile os arquivos TypeScript para JavaScript:

   ```bash
   npx tsc --outDir dist
   ```

2. Gere a documentação com JSDoc:

   ```bash
   npx jsdoc dist/model/services/NomeDoArquivo.js -d docs
   ```

   - Substitua `NomeDoArquivo.js` pelo service desejado.
   - A documentação será gerada na pasta `docs`.

3. Abra o arquivo `docs/index.html` no navegador para visualizar.

Para documentar todos os services de uma vez:

```bash
npx jsdoc dist/model/services/*.js -d docs
```

---

## Testes Unitários

Este projeto utiliza Jest com suporte a TypeScript (ts-jest) para garantir a qualidade do código.

### Estrutura dos testes

- Os testes estão organizados em:
  - `__test__/repositories`: testes dos repositórios
  - `__test__/services`: testes dos serviços

### Estratégias de Mock

- Supabase: mock dos métodos (`select`, `insert`, etc.)
- Fetch API: simulação da API do IBGE
- Cache interno: método `__resetCache` para limpar estado entre testes

### Executando os testes

```bash
npm test
```

Para rodar um teste específico:

```bash
npm test -- __test__/repositories/EmailRepository.test.ts
```

### Cobertura

- EmailRepository: CRUD, estatísticas e agrupamentos
- ProfileRepository: operações de perfil
- LocationRepository: busca via IBGE com cache
- Services: lógica de negócio

---

## Autores

* Larissa Souza - [larissaNa](https://github.com/larissaNa)
* Maria Isabelly - [Isabellybrt](https://github.com/Isabellybrt)