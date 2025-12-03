import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Clock, Mail, BarChart3, ArrowRight } from 'lucide-react';

export function QuickActionsCard() {
  return (
    <Card className="animate-fade-in stagger-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Atalhos Rápidos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Link to="/pendentes">
          <Button variant="outline" className="w-full justify-between group">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Ver Pendentes
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
        <Link to="/novo">
          <Button variant="outline" className="w-full justify-between group">
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Novo Manual
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
        <Link to="/lista">
          <Button variant="outline" className="w-full justify-between group">
            <span className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Lista Geral
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

