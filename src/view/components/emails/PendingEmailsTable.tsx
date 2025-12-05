import { Card, CardContent } from "../ui/card";
import { LocationSelect } from "../ui/location-select";
import { Mail, Loader2 } from "lucide-react";

interface PendingEmailView {
  id: string;
  remetente: string;
  destinatario: string;
  formattedDate: string;
  estado: string;
  municipio: string;
}

interface PendingEmailsTableProps {
  emails: PendingEmailView[];
  isLoading: boolean;
  emailUpdates: Record<string, { estado: string; municipio: string }>;
  getEmailLocation: (emailId: string) => { estado: string; municipio: string } | undefined;

  onLocationChange: (
    emailId: string,
    field: "estado" | "municipio",
    value: string
  ) => void;
}

export function PendingEmailsTable({
  emails,
  isLoading,
  onLocationChange,
}: PendingEmailsTableProps) {
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
            <p>Nenhum e-mail pendente encontrado</p>
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
                <th className="text-left p-4 font-medium">Data</th>
                <th className="text-left p-4 font-medium">Local</th>
              </tr>
            </thead>

            <tbody>
              {emails.map((email) => (
                <tr key={email.id} className="border-b table-row-hover">
                  <td className="p-4">
                    <span className="font-medium">{email.remetente}</span>
                  </td>

                  <td className="p-4 text-muted-foreground">
                    {email.destinatario}
                  </td>

                  <td className="p-4 text-muted-foreground">
                    {email.formattedDate}
                  </td>

                  <td className="p-4">
                    <LocationSelect
                      compact
                      estado={email.estado}
                      municipio={email.municipio}
                      onEstadoChange={(val) =>
                        onLocationChange(email.id, "estado", val)
                      }
                      onMunicipioChange={(val) =>
                        onLocationChange(email.id, "municipio", val)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
