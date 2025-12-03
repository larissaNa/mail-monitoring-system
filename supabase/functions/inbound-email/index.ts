import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Headers para CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, resend-signature",
};

interface EmailData {
  remetente: string;
  destinatario: string;
  assunto: string;
  corpo: string | null; 
  data_envio: string;
  estado: string | null;
  municipio: string | null;
  classificado: boolean;
  colaborador_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

function htmlToText(html: string | null): string | null {
  if (!html) return null;
  return html
    .replace(/<[^>]+>/g, "")   
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const emailInfo = body.data || body;

    console.log("Email recebido (raw):", JSON.stringify(emailInfo, null, 2));

    if (!emailInfo.email_id) {
      return new Response(JSON.stringify({ error: "Missing email_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Chamar API de Recebimento do Resend ---
    const resendApiKey = Deno.env.get("RESEND_API_KEY")!;
    const emailId = emailInfo.email_id;

    const resendResponse = await fetch(`https://api.resend.com/emails/receiving/${emailId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error("Erro ao buscar email completo:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to fetch full email", details: errorText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const fullEmail = await resendResponse.json();
    console.log("Email completo (raw):", JSON.stringify(fullEmail, null, 2));
    console.log("Campo 'to' tipo:", typeof fullEmail.to, "valor:", fullEmail.to);
    console.log("Campo 'cc' tipo:", typeof fullEmail.cc, "valor:", fullEmail.cc);
    console.log("Campo 'bcc' tipo:", typeof fullEmail.bcc, "valor:", fullEmail.bcc);

    const sistemaEmail = "teste@nareefa.resend.app";

    // Função para extrair apenas o e-mail de uma string que pode conter "Nome <email@exemplo.com>" ou apenas "email@exemplo.com"
    const extrairEmailDeString = (str: string): string => {
      if (!str) return "";
      
      // Se contém < e >, extrair o que está entre eles
      const match = str.match(/<([^>]+)>/);
      if (match && match[1]) {
        return match[1].trim();
      }
      
      // Se não, retornar a string inteira (pode ser apenas o email)
      return str.trim();
    };

    // Função auxiliar para extrair e-mails de um campo (pode ser string, array de strings, ou array de objetos)
    const extrairEmails = (campo: any): string[] => {
      if (!campo) return [];
      
      // Se for string
      if (typeof campo === "string") {
        // Se contém vírgulas, pode ser múltiplos e-mails separados
        if (campo.includes(",")) {
          return campo
            .split(",")
            .map(item => extrairEmailDeString(item.trim()))
            .filter(email => email && email.includes("@"));
        }
        // Se não, é um único e-mail (pode ter nome ou não)
        const email = extrairEmailDeString(campo);
        return email && email.includes("@") ? [email] : [];
      }
      
      // Se for array
      if (Array.isArray(campo)) {
        return campo
          .map((item: any) => {
            // Se o item é string, extrair email
            if (typeof item === "string") {
              return extrairEmailDeString(item);
            }
            // Se o item é objeto com propriedade email
            if (item && typeof item === "object") {
              if (item.email) {
                return typeof item.email === "string" 
                  ? extrairEmailDeString(item.email) 
                  : item.email;
              }
              // Pode ter propriedade name e email separados
              if (item.address || item.mailbox) {
                return extrairEmailDeString(item.address || item.mailbox);
              }
            }
            return null;
          })
          .filter((email): email is string => !!email && email.includes("@"));
      }
      
      return [];
    };

    // Coletar todos os destinatários (to, cc, bcc)
    // Verificar também estruturas aninhadas que o Resend pode retornar
    const toField = fullEmail.to || fullEmail.recipients?.to || fullEmail.data?.to;
    const ccField = fullEmail.cc || fullEmail.recipients?.cc || fullEmail.data?.cc;
    const bccField = fullEmail.bcc || fullEmail.recipients?.bcc || fullEmail.data?.bcc;
    
    // IMPORTANTE: Os headers também contêm os destinatários reais!
    // O campo 'to' pode conter apenas o endereço inbound, mas os headers têm todos os destinatários
    const headers = fullEmail.headers || {};
    const toHeader = headers.to || headers.To || "";
    const ccHeader = headers.cc || headers.Cc || "";
    const bccHeader = headers.bcc || headers.Bcc || "";
    
    console.log("Headers 'to':", toHeader);
    console.log("Headers 'cc':", ccHeader);
    console.log("Headers 'bcc':", bccHeader);
    
    // Coletar de todas as fontes: campos diretos E headers
    const todosDestinatarios = [
      ...extrairEmails(toField),
      ...extrairEmails(ccField),
      ...extrairEmails(bccField),
      ...extrairEmails(toHeader),  // Headers têm os destinatários reais!
      ...extrairEmails(ccHeader),
      ...extrairEmails(bccHeader),
    ];

    console.log("Todos os destinatários extraídos (antes do filtro):", todosDestinatarios);
    console.log("E-mail do sistema a ser filtrado:", sistemaEmail);

    // Normalizar e-mails para comparação (lowercase e trim)
    const todosDestinatariosNormalizados = todosDestinatarios.map(email => email.toLowerCase().trim());

    // Remover duplicatas mantendo o formato original
    const destinatariosUnicos: string[] = [];
    const vistos = new Set<string>();
    
    todosDestinatarios.forEach((email, index) => {
      const normalizado = todosDestinatariosNormalizados[index];
      if (!vistos.has(normalizado)) {
        vistos.add(normalizado);
        destinatariosUnicos.push(email);
      }
    });

    console.log("Destinatários únicos (após remover duplicatas):", destinatariosUnicos);

    // Filtrar apenas e-mails de clientes (remover e-mail do sistema)
    const sistemaEmailNormalizado = sistemaEmail.toLowerCase().trim();
    const destinatariosClientes = destinatariosUnicos.filter(email => {
      const emailNormalizado = email.toLowerCase().trim();
      const isSistema = emailNormalizado === sistemaEmailNormalizado;
      if (isSistema) {
        console.log(`Removendo e-mail do sistema: ${email}`);
      }
      return !isSistema;
    });

    console.log("Destinatários de clientes (após filtrar sistema):", destinatariosClientes);

    // Validar que há pelo menos um destinatário cliente
    if (destinatariosClientes.length === 0) {
      console.warn("Nenhum destinatário cliente encontrado. Todos os destinatários são do sistema.");
      return new Response(
        JSON.stringify({ 
          error: "No client recipients found", 
          message: "All recipients are system emails" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Juntar todos os destinatários de clientes separados por vírgula
    const destinatarioFinal = destinatariosClientes.join(", ");
    
    console.log("Destinatários filtrados (apenas clientes):", destinatariosClientes);
    console.log("Destinatário final salvo:", destinatarioFinal);
    
    const corpo = htmlToText(fullEmail.html || fullEmail.text || null); 

    // Validar campos obrigatórios antes de salvar
    if (!fullEmail.from || !destinatarioFinal || !fullEmail.subject) {
      console.error("Campos obrigatórios faltando:", {
        from: fullEmail.from,
        destinatario: destinatarioFinal,
        subject: fullEmail.subject,
      });
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields", 
          details: "from, destinatario, or subject is missing" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const emailData: EmailData = {
      remetente: fullEmail.from,
      destinatario: destinatarioFinal,
      assunto: fullEmail.subject || "(Sem assunto)",
      corpo,
      data_envio: fullEmail.created_at || new Date().toISOString(),
      estado: null,
      municipio: null,
      classificado: false,
      colaborador_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("Dados do email a serem salvos:", {
      remetente: emailData.remetente,
      destinatario: emailData.destinatario,
      assunto: emailData.assunto,
      data_envio: emailData.data_envio,
    });

    // --- Conectar ao Supabase ---
    const supabaseUrl = Deno.env.get("PROJECT_URL")!;
    const supabaseServiceKey = Deno.env.get("SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase.from("emails").insert(emailData).select().single();

    if (error) {
      console.error("Erro ao salvar email:", error);
      return new Response(
        JSON.stringify({ error: "Failed to save email", details: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Email salvo com sucesso:", data.id);

    return new Response(
      JSON.stringify({
        success: true,
        emailId: data.id,
        message: "Email received and saved successfully",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Erro inesperado:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
