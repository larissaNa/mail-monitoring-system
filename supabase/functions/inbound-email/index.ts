import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, resend-signature',
}

interface ResendInboundPayload {
  from: string;
  to: string[];       // <-- aqui deve ser array
  subject: string;
  text?: string;
  html?: string;
  date: string;
  headers?: Record<string, string>;
}

interface EmailData {
  remetente: string;
  destinatario: string;
  assunto: string;
  corpo: string | null;
  data_envio: string;
  estado: string | null;
  municipio: string | null;
  classificado: boolean;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verificar assinatura do webhook (segurança)
    const signature = req.headers.get('resend-signature')
    const webhookSecret = Deno.env.get('RESEND_WEBHOOK_SECRET')
    
    if (webhookSecret) {
      // Se o secret está configurado, validar a assinatura
      if (!signature) {
        console.error('Missing webhook signature')
        return new Response(
          JSON.stringify({ error: 'Missing signature header' }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      // Validação da assinatura
      // Nota: O Resend pode usar diferentes formatos de assinatura
      // Esta é uma validação básica - ajuste conforme a documentação do Resend
      if (signature !== webhookSecret) {
        console.error('Invalid webhook signature')
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    } else {
      // Se não há secret configurado, apenas logar um aviso
      console.warn('RESEND_WEBHOOK_SECRET not configured - webhook validation disabled')
    }

    // Parse do payload
    const payload: ResendInboundPayload = await req.json()
    
    console.log('Received inbound email:', {
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      date: payload.date
    })

    // Validação dos dados obrigatórios
    if (!payload.from || !payload.to || !payload.subject || !payload.date) {
      console.error('Missing required fields:', payload)
      return new Response(
        JSON.stringify({ error: 'Missing required fields: from, to, subject, date' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Extrair corpo do e-mail (priorizar HTML, depois texto)
    const corpo = payload.html || payload.text || null

    // Preparar dados para inserção
    const emailData = {
      remetente: payload.from,
      destinatario: payload.to.join(', '), // transformar array em string
      assunto: payload.subject,
      corpo: payload.html || payload.text || null,
      estado: null,
      municipio: null,
      classificado: false
    }
    

    // Conectar ao Supabase usando service role key
    const supabaseUrl = Deno.env.get('PROJECT_URL')!;
    const supabaseServiceKey = Deno.env.get('SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Inserir e-mail no banco de dados
    const { data, error } = await supabase
      .from('emails')
      .insert(emailData)
      .select()
      .single()
    

    if (error) {
      console.error('Error inserting email:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to save email', details: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Email saved successfully:', data.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: data.id,
        message: 'Email received and saved successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

