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
  corpo: string | null;  // apenas um campo agora, texto puro
  data_envio: string;
  estado: string | null;
  municipio: string | null;
  classificado: boolean;
  colaborador_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Função para converter HTML em texto puro
function htmlToText(html: string | null): string | null {
  if (!html) return null;
  return html
    .replace(/<[^>]+>/g, "")   // Remove tags
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
    console.log("Email completo:", JSON.stringify(fullEmail, null, 2));

    // --- Preparar dados para inserir no Supabase ---
    const corpo = htmlToText(fullEmail.html || fullEmail.text || null); // já limpo
    const emailData: EmailData = {
      remetente: fullEmail.from,
      destinatario: (fullEmail.to || []).join(", "),
      assunto: fullEmail.subject,
      corpo,
      data_envio: fullEmail.created_at,
      estado: null,
      municipio: null,
      classificado: false,
      colaborador_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

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
