import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const frequencyData = [
  { day: 'Dom', frequency: 95, newVisitors: 8 },
  { day: 'Seg', frequency: 0, newVisitors: 0 },
  { day: 'Ter', frequency: 12, newVisitors: 2 },
  { day: 'Qua', frequency: 78, newVisitors: 5 },
  { day: 'Qui', frequency: 15, newVisitors: 1 },
  { day: 'Sex', frequency: 45, newVisitors: 3 },
  { day: 'Sáb', frequency: 32, newVisitors: 4 },
];

export function FrequencyChart() {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Frequência Semanal</h3>
        <p className="text-sm text-muted-foreground">Comparativo de presença por dia da semana</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={frequencyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 15%)" />
            <XAxis 
              dataKey="day" 
              stroke="hsl(240 5% 65%)"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(240 5% 65%)"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(240 10% 8%)',
                border: '1px solid hsl(240 6% 15%)',
                borderRadius: '8px',
                color: 'hsl(0 0% 98%)'
              }}
            />
            <Bar 
              dataKey="frequency" 
              fill="hsl(217 91% 50%)"
              radius={[4, 4, 0, 0]}
              name="Membros Regulares"
            />
            <Bar 
              dataKey="newVisitors" 
              fill="hsl(270 95% 75%)"
              radius={[4, 4, 0, 0]}
              name="Novos Visitantes"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary"></div>
          <span className="text-muted-foreground">Membros Regulares</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-accent"></div>
          <span className="text-muted-foreground">Novos Visitantes</span>
        </div>
      </div>
    </Card>
  );
}