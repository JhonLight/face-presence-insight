import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const data = [
  { time: '08:00', attendance: 45, capacity: 150 },
  { time: '08:30', attendance: 89, capacity: 150 },
  { time: '09:00', attendance: 132, capacity: 150 },
  { time: '09:30', attendance: 148, capacity: 150 },
  { time: '10:00', attendance: 145, capacity: 150 },
  { time: '10:30', attendance: 142, capacity: 150 },
  { time: '11:00', attendance: 138, capacity: 150 },
];

export function AttendanceChart() {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Presença em Tempo Real</h3>
        <p className="text-sm text-muted-foreground">Fluxo de pessoas durante o evento</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(217 91% 50%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(217 91% 50%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 15%)" />
            <XAxis 
              dataKey="time" 
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
            <Area
              type="monotone"
              dataKey="attendance"
              stroke="hsl(217 91% 50%)"
              fillOpacity={1}
              fill="url(#attendanceGradient)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="capacity"
              stroke="hsl(240 5% 65%)"
              strokeDasharray="5 5"
              strokeWidth={1}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}