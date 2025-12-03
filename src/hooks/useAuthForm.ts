import { useState } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { loginSchema, signupSchema, resetPasswordSchema, type LoginFormData, type SignupFormData, type ResetPasswordFormData } from '@/lib/validationSchemas';
import { z } from 'zod';

export function useLoginForm() {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      loginSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ variant: 'destructive', title: error.errors[0].message });
        return;
      }
    }

    setLoading(true);
    const { error } = await signIn(formData.email, formData.password);
    setLoading(false);

    if (error) {
      toast({ 
        variant: 'destructive', 
        title: 'Erro ao entrar', 
        description: error.message === 'Invalid login credentials' 
          ? 'E-mail ou senha incorretos' 
          : error.message 
      });
    }
  };

  return {
    formData,
    setFormData,
    loading,
    handleSubmit,
  };
}

export function useSignupForm() {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({ nome: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      signupSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ variant: 'destructive', title: error.errors[0].message });
        return;
      }
    }

    setLoading(true);
    const { error } = await signUp(formData.email, formData.password, formData.nome);
    setLoading(false);

    if (error) {
      if (error.message.includes('already registered')) {
        toast({ variant: 'destructive', title: 'Este e-mail já está cadastrado' });
      } else {
        toast({ variant: 'destructive', title: 'Erro ao cadastrar', description: error.message });
      }
    } else {
      toast({ title: 'Conta criada com sucesso!', description: 'Você já pode fazer login.' });
    }
  };

  return {
    formData,
    setFormData,
    loading,
    handleSubmit,
  };
}

export function useResetPasswordForm() {
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetPasswordSchema.safeParse({ email }).success) {
      toast({ variant: 'destructive', title: 'E-mail inválido' });
      return;
    }

    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);

    if (error) {
      toast({ variant: 'destructive', title: 'Erro', description: error.message });
    } else {
      toast({ title: 'E-mail enviado', description: 'Verifique sua caixa de entrada.' });
      return true;
    }
    return false;
  };

  return {
    email,
    setEmail,
    loading,
    handleSubmit,
  };
}

