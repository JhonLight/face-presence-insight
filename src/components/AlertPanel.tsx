import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Clock, Users } from "lucide-react";

const alerts = [
  {
    id: 1,
    type: 'warning',
    title: 'Frequentadores Ausentes',
    description: '12 membros regulares não compareceram hoje',
    time: 'há 5 min',
    action: 'Enviar lembrete'
  },
  {
    id: 2,
    type: 'success',
    title: 'Capacidade Otimal',
    description: 'Evento atingiu 95% da capacidade recomendada',
    time: 'há 2 min',
    action: 'Ver detalhes'
  },
  {
    id: 3,
    type: 'info',
    title: 'Novos Visitantes',
    description: '8 rostos não identificados detectados',
    time: 'há 1 min',
    action: 'Registrar'
  }
];

export function AlertPanel() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case 'warning': return 'destructive';
      case 'success': return 'default';
      default: return 'secondary';
    }
  };

  const getBadgeLabel = (type: string) => {
    switch (type) {
      case 'warning': return 'Alerta';
      case 'success': return 'Sucesso';
      case 'info': return 'Info';
      default: return 'Info';
    }
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Alertas do Sistema</h3>
        <Badge variant="outline" className="text-xs">
          <Clock className="h-3 w-3 mr-1" />
          Tempo Real
        </Badge>
      </div>
      
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div 
            key={alert.id}
            className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors group"
          >
            <div className={`p-2 rounded-full ${
              alert.type === 'warning' ? 'bg-destructive/10 text-destructive' :
              alert.type === 'success' ? 'bg-success/10 text-success' :
              'bg-primary/10 text-primary'
            }`}>
              {getIcon(alert.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-medium">{alert.title}</h4>
                <Badge variant={getBadgeVariant(alert.type)} className="text-xs">
                  {getBadgeLabel(alert.type)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{alert.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{alert.time}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {alert.action}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}