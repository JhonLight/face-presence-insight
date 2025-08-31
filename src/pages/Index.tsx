import { MetricCard } from "@/components/MetricCard";
import { AttendanceChart } from "@/components/AttendanceChart";
import { AlertPanel } from "@/components/AlertPanel";
import { FrequencyChart } from "@/components/FrequencyChart";
import { Users, Eye, UserCheck, TrendingUp, Camera, Shield } from "lucide-react";
const Index = () => {
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Visão de presença facialInsight</h1>
                <p className="text-sm text-muted-foreground">Sistema de Análise de Presença</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                <span>Ao Vivo</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/30">
                <Shield className="h-4 w-4" />
                <span>Dados Anonimizados</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Demo Info */}
        <div className="text-center py-8 mb-8">
          <div className="max-w-2xl mx-auto bg-gradient-primary p-8 rounded-2xl text-white">
            <Camera className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl font-bold mb-3">Demonstração Interativa</h2>
            <p className="text-lg opacity-90 mb-4">
              Este dashboard exibe dados simulados em tempo real do sistema de reconhecimento facial
            </p>
            <p className="text-sm opacity-75">
              Processamento anonimizado • Conformidade LGPD • Tecnologia Azure Face API
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard title="Total Presente" value="148" change={12} trend="up" subtitle="de 150 lugares" icon={<Users className="h-5 w-5" />} />
          
          <MetricCard title="Membros Regulares" value="142" change={8} trend="up" subtitle="frequência ativa" icon={<UserCheck className="h-5 w-5" />} />
          
          <MetricCard title="Novos Visitantes" value="6" change={25} trend="up" subtitle="rostos não identificados" icon={<TrendingUp className="h-5 w-5" />} />
          
          <MetricCard title="Taxa de Ocupação" value="98.7%" change={5} trend="up" subtitle="capacidade otimal" icon={<Camera className="h-5 w-5" />} />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <AttendanceChart />
          </div>
          <div>
            <AlertPanel />
          </div>
        </div>

        {/* Frequency Chart */}
        <div className="mb-8">
          <FrequencyChart />
        </div>

      </main>
    </div>;
};
export default Index;