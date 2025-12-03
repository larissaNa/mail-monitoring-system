import { useMutation, useQueryClient } from '@tanstack/react-query';
import { emailService } from '@/services/emailService';
import { useToast } from './use-toast';
import { Email } from '@/types';

export function useUpdateEmail() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Email> }) => {
      return await emailService.update(id, updates);
    },
    onSuccess: (_, variables) => {
      toast({ title: 'Localização atualizada!' });
      queryClient.invalidateQueries({ queryKey: ['email', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (error: Error) => {
      toast({ variant: 'destructive', title: 'Erro', description: error.message });
    },
  });
}

export function useUpdateManyEmails() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: { id: string; estado: string; municipio: string }[]) => {
      if (updates.length === 0) {
        throw new Error('Nenhum e-mail com classificação completa');
      }
      await emailService.updateMany(updates);
    },
    onSuccess: () => {
      toast({ title: 'Classificações salvas com sucesso!' });
      queryClient.invalidateQueries({ queryKey: ['pending-emails'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (error: Error) => {
      toast({ variant: 'destructive', title: 'Erro', description: error.message });
    },
  });
}

export function useCreateEmail() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: Omit<Email, 'id' | 'created_at' | 'updated_at'>) => {
      return await emailService.create(email);
    },
    onSuccess: () => {
      toast({ title: 'E-mail cadastrado com sucesso!' });
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (error: Error) => {
      toast({ variant: 'destructive', title: 'Erro ao cadastrar', description: error.message });
    },
  });
}

