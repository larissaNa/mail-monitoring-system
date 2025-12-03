import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Mail, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Email } from '@/types';
import { formatters } from '@/lib/formatters';

interface EmailTableProps {
  emails: Email[];
  isLoading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function EmailTable({ emails, isLoading, currentPage, totalPages, onPageChange }: EmailTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (emails.length === 0) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Mail className="h-12 w-12 mb-4 opacity-50" />
            <p>Nenhum e-mail encontrado</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-medium">Remetente</th>
                <th className="text-left p-4 font-medium">Destinatário</th>
                <th className="text-left p-4 font-medium">Assunto</th>
                <th className="text-left p-4 font-medium">Local</th>
                <th className="text-left p-4 font-medium w-20">Ações</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((email) => (
                <tr key={email.id} className="border-b table-row-hover">
                  <td className="p-4">
                    <span className="font-medium">{email.remetente}</span>
                  </td>
                  <td className="p-4 text-muted-foreground">{email.destinatario}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="truncate max-w-[200px]">{email.assunto}</span>
                      {!email.classificado && (
                        <Badge variant="outline" className="bg-warning-light text-warning border-warning/30">
                          Pendente
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {formatters.locationShort(email.estado, email.municipio)}
                  </td>
                  <td className="p-4">
                    <Link to={`/email/${email.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

