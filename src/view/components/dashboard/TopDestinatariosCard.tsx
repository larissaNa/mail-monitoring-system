import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users } from 'lucide-react';
import { TopDestinatario } from '@/model/entities';

interface TopDestinatariosCardProps {
  topDestinatarios: TopDestinatario[];
}

export function TopDestinatariosCard({ topDestinatarios }: TopDestinatariosCardProps) {
  return (
    <Card className="animate-fade-in stagger-3">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Top 3 Destinatários
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topDestinatarios.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum dado disponível
            </p>
          ) : (
            topDestinatarios.map((item, index) => (
              <div key={item.destinatario} className="flex items-center gap-4">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                  ${index === 0 ? 'bg-primary text-primary-foreground' : 
                    index === 1 ? 'bg-accent text-accent-foreground' : 
                    'bg-muted text-muted-foreground'}
                `}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.destinatario}</p>
                </div>
                <div className="font-semibold text-muted-foreground">
                  ({item.count})
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

