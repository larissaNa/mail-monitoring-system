-- Migration para garantir estrutura correta da tabela emails
-- e adicionar políticas RLS para permitir inserção via service role

-- Verificar e ajustar estrutura da tabela emails se necessário
-- (A tabela já existe, mas garantimos que está correta)

-- Adicionar política RLS para permitir inserção via service role (Edge Functions)
-- Isso permite que a Edge Function insira e-mails sem autenticação de usuário

-- Remover política existente de INSERT se necessário e criar uma mais permissiva
DROP POLICY IF EXISTS "Authenticated users can insert emails" ON public.emails;

-- Criar política que permite inserção para usuários autenticados
CREATE POLICY "Authenticated users can insert emails"
  ON public.emails FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Criar política adicional para service role (usado pela Edge Function)
-- Nota: Service role bypassa RLS por padrão, mas é bom documentar
-- A Edge Function usa service_role_key que tem acesso total

-- Garantir que os campos obrigatórios estão corretos
-- Verificar se a tabela tem todos os campos necessários
DO $$
BEGIN
  -- Verificar se a coluna data_envio existe e é do tipo correto
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'emails' 
    AND column_name = 'data_envio'
  ) THEN
    ALTER TABLE public.emails 
    ADD COLUMN data_envio TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;

  -- Garantir que estado e municipio são nullable (apenas se não forem já nullable)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'emails' 
    AND column_name = 'estado'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE public.emails 
    ALTER COLUMN estado DROP NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'emails' 
    AND column_name = 'municipio'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE public.emails 
    ALTER COLUMN municipio DROP NOT NULL;
  END IF;

  -- Garantir que classificado tem default false (se não tiver default)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'emails' 
    AND column_name = 'classificado'
    AND column_default IS NOT NULL
  ) THEN
    ALTER TABLE public.emails 
    ALTER COLUMN classificado SET DEFAULT false;
  END IF;
END $$;

-- Comentários para documentação
COMMENT ON TABLE public.emails IS 'Tabela de e-mails recebidos, incluindo e-mails recebidos via inbound do Resend';
COMMENT ON COLUMN public.emails.remetente IS 'E-mail do remetente';
COMMENT ON COLUMN public.emails.destinatario IS 'E-mail do destinatário (pode ser o endereço inbound do Resend)';
COMMENT ON COLUMN public.emails.data_envio IS 'Data e hora de envio do e-mail (recebido do Resend)';
COMMENT ON COLUMN public.emails.estado IS 'Estado classificado (pode ser NULL inicialmente)';
COMMENT ON COLUMN public.emails.municipio IS 'Município classificado (pode ser NULL inicialmente)';

