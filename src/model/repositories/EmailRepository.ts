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
    const formatosOriginais: Record<string, string> = {}; 
    
    data.forEach(email => {
      if (!email.destinatario) return;
      
      const destinatarios = email.destinatario
        .split(',')
        .map(d => d.trim())
        .filter(d => d && d.includes('@')); 
      destinatarios.forEach(destinatario => {
        const emailNormalizado = destinatario.toLowerCase().trim();
        
        counts[emailNormalizado] = (counts[emailNormalizado] || 0) + 1;
        
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
    const toLocalDateString = (isoString: string): string => {
      if (!isoString) return '';
      
      let dateStr = isoString.trim();
      
      if (!dateStr.endsWith('Z') && !dateStr.match(/[+-]\d{2}:?\d{2}$/)) {
        if (dateStr.includes('T')) {
          dateStr = dateStr.replace(/\.\d+$/, '') + 'Z';
        }
      }
      
      const date = new Date(dateStr);
      
      if (isNaN(date.getTime())) {
        return '';
      }
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
  
    const getLocalDateString = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
  
    const now = new Date();
    const todayLocal = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0, 0, 0, 0
    );
  
    const sevenDaysAgo = new Date(todayLocal);
    sevenDaysAgo.setDate(todayLocal.getDate() - 7);
  
    const sevenDaysAgoUTC = new Date(sevenDaysAgo.getTime() - (now.getTimezoneOffset() * 60000));
  
    const { data, error } = await supabase
      .from("emails")
      .select("data_envio")
      .gte("data_envio", sevenDaysAgoUTC.toISOString());
  
    if (error) throw error;
  
    const counts: Record<string, number> = {};
  
    for (let i = 6; i >= 0; i--) {
      const d = new Date(todayLocal);
      d.setDate(todayLocal.getDate() - i);
      const dateKey = getLocalDateString(d);
      counts[dateKey] = 0;
    }
  
    data.forEach(email => {
      if (email.data_envio) {
        const dateStr = toLocalDateString(email.data_envio);
        if (dateStr && counts[dateStr] !== undefined) {
          counts[dateStr]++;
        }
      }
    });
  
    return Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
  
  
}
