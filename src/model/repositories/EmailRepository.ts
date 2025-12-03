import { supabase } from '@/infrastructure/supabase/client';
import { Email, DashboardStats, EmailsByState, TopDestinatario, TrendData } from '@/model/entities';

export class EmailRepository {
  static async getAll(): Promise<Email[]> {
    const { data, error } = await supabase
      .from('emails')
      .select('*')
      .order('data_envio', { ascending: false });
    
    if (error) throw error;
    return data as Email[];
  }

  static async getPending(): Promise<Email[]> {
    const { data, error } = await supabase
      .from('emails')
      .select('*')
      .eq('classificado', false)
      .order('data_envio', { ascending: false });
    
    if (error) throw error;
    return data as Email[];
  }

  static async getById(id: string): Promise<Email | null> {
    const { data, error } = await supabase
      .from('emails')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data as Email | null;
  }

  static async create(email: Omit<Email, 'id' | 'created_at' | 'updated_at'>): Promise<Email> {
    const { data, error } = await supabase
      .from('emails')
      .insert(email)
      .select()
      .single();
    
    if (error) throw error;
    return data as Email;
  }

  static async update(id: string, updates: Partial<Email>): Promise<Email> {
    const { data, error } = await supabase
      .from('emails')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Email;
  }

  static async updateMany(emails: { id: string; estado: string; municipio: string }[]): Promise<void> {
    const promises = emails.map(email => 
      supabase
        .from('emails')
        .update({ 
          estado: email.estado, 
          municipio: email.municipio,
          classificado: !!(email.estado && email.municipio)
        })
        .eq('id', email.id)
    );
    
    await Promise.all(promises);
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('emails')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  static async getStats(): Promise<DashboardStats> {
    const { data, error } = await supabase
      .from('emails')
      .select('classificado');
    
    if (error) throw error;
    
    const total = data.length;
    const classificados = data.filter(e => e.classificado).length;
    const pendentes = total - classificados;
    
    return { total, classificados, pendentes };
  }

  static async getEmailsByState(): Promise<EmailsByState[]> {
    const { data, error } = await supabase
      .from('emails')
      .select('estado')
      .not('estado', 'is', null);
    
    if (error) throw error;
    
    const counts: Record<string, number> = {};
    data.forEach(email => {
      if (email.estado) {
        counts[email.estado] = (counts[email.estado] || 0) + 1;
      }
    });
    
    return Object.entries(counts)
      .map(([estado, count]) => ({ estado, count }))
      .sort((a, b) => b.count - a.count)
  }

  static async getTopDestinatarios(): Promise<TopDestinatario[]> {
    const { data, error } = await supabase
      .from('emails')
      .select('destinatario');
    
    if (error) throw error;
    
    const counts: Record<string, number> = {};
    const formatosOriginais: Record<string, string> = {}; // Para preservar formato original
    
    // Processar cada email e contar destinatários individualmente
    data.forEach(email => {
      if (!email.destinatario) return;
      
      // Separar múltiplos destinatários (podem estar separados por vírgula)
      const destinatarios = email.destinatario
        .split(',')
        .map(d => d.trim())
        .filter(d => d && d.includes('@')); // Filtrar apenas e-mails válidos
      
      // Contar cada destinatário individualmente
      destinatarios.forEach(destinatario => {
        const emailNormalizado = destinatario.toLowerCase().trim();
        
        // Contar (usando lowercase para agrupar)
        counts[emailNormalizado] = (counts[emailNormalizado] || 0) + 1;
        
        // Preservar formato original do primeiro encontrado
        if (!formatosOriginais[emailNormalizado]) {
          formatosOriginais[emailNormalizado] = destinatario.trim();
        }
      });
    });
    
    return Object.entries(counts)
      .map(([emailNormalizado, count]) => ({ 
        destinatario: formatosOriginais[emailNormalizado] || emailNormalizado,
        count 
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }

  static async getTrend(): Promise<TrendData[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data, error } = await supabase
      .from('emails')
      .select('data_envio')
      .gte('data_envio', sevenDaysAgo.toISOString());
    
    if (error) throw error;
    
    const counts: Record<string, number> = {};
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      counts[dateStr] = 0;
    }
    
    data.forEach(email => {
      const dateStr = email.data_envio.split('T')[0];
      if (counts[dateStr] !== undefined) {
        counts[dateStr]++;
      }
    });
    
    return Object.entries(counts).map(([date, count]) => ({ date, count }));
  }
}
