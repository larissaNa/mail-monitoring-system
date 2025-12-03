export interface Profile {
  id: string;
  email: string;
  nome: string;
  tipo_usuario: 'admin' | 'colaborador';
  created_at: string;
  updated_at: string;
}
