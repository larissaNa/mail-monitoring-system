import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EmailService } from '@/model/services';
import { useToast } from '../../view/components/ui/hooks/use-toast';
import { Email } from '@/model/entities';

export function useUpdateEmail() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Email> }) => {
      return await EmailService.update(id, updates);
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
      await EmailService.updateMany(updates);
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
      return await EmailService.create(email);
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

export function useDeleteEmail() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await EmailService.delete(id);
    },
    onSuccess: () => {
      toast({ title: 'E-mail excluído com sucesso!' });
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      queryClient.invalidateQueries({ queryKey: ['pending-emails'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (error: Error) => {
      toast({ variant: 'destructive', title: 'Erro ao excluir', description: error.message });
    },
  });
}

