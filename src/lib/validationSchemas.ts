import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const signupSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
});

export const emailSchema = z.object({
  remetente: z.string().email('E-mail do remetente inválido'),
  destinatario: z.string().email('E-mail do destinatário inválido'),
  assunto: z.string().min(1, 'Assunto é obrigatório'),
  corpo: z.string().optional(),
  data_envio: z.string().min(1, 'Data é obrigatória'),
  estado: z.string().min(1, 'Estado é obrigatório'),
  municipio: z.string().min(1, 'Município é obrigatório'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type EmailFormData = z.infer<typeof emailSchema>;

