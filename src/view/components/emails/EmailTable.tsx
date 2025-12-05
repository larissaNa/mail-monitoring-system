import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Eye, Trash, Mail, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

interface EmailTableViewProps {
  rows: {
    id: string;
    remetente: string;
    destinatario: string;
    assunto: string;
    classificado: boolean;
    local: string;
    detailsUrl: string;
  }[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;

  // actions vindas da ViewModel
  onPageChange: (page: number) => void;
  onRequestDelete: (id: string) => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  deleteDialogOpen: boolean;
  deleting: boolean;
}

export function EmailTableView({
  rows,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
  deleteDialogOpen,
  deleting,
}: EmailTableViewProps) {
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

  if (rows.length === 0) {
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
                <th className="p-4">Remetente</th>
                <th className="p-4">Destinatário</th>
                <th className="p-4">Assunto</th>
                <th className="p-4">Local</th>
                <th className="p-4 w-20">Ações</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id} className="border-b table-row-hover">
                  <td className="p-4">{row.remetente}</td>
                  <td className="p-4 text-muted-foreground">{row.destinatario}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="truncate max-w-[200px]">{row.assunto}</span>
                      {!row.classificado && (
                        <Badge variant="outline" className="bg-warning-light text-warning border-warning/30">
                          Pendente
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{row.local}</td>
                  <td className="p-4 flex gap-2">
                    <Link to={row.detailsUrl}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-red-600 hover:bg-red-50"
                      onClick={() => onRequestDelete(row.id)}
                      disabled={deleting}
                    >
                      {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
                    </Button>
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
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={open => !open && onCancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir e-mail</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este e-mail? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex gap-3 justify-end">
            <AlertDialogCancel onClick={onCancelDelete}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
