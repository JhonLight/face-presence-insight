import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Eye, Download, ChevronUp, ChevronDown, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// Dados de exemplo
const mockData = [
  {
    id: "P-0001",
    nome: "João Silva",
    tipo: "Regular",
    ultimaPresenca: "05/09/2025",
    totalPresencas: 12,
    eventoId: "EVT-2025-09-07-001",
    local: "Igreja Central",
    dataEvento: "07/09/2025",
    horario: "09:30",
    periodo: "Manhã",
    novidade: "Não",
    score: 98,
    link: "#"
  },
  {
    id: "P-0034",
    nome: "Maria Souza",
    tipo: "Regular",
    ultimaPresenca: "12/09/2025",
    totalPresencas: 7,
    eventoId: "EVT-2025-09-14-001",
    local: "Igreja Central",
    dataEvento: "14/09/2025",
    horario: "09:00",
    periodo: "Manhã",
    novidade: "Não",
    score: 95,
    link: "#"
  },
  {
    id: "P-0078",
    nome: "Desconhecido",
    tipo: "Novo",
    ultimaPresenca: "",
    totalPresencas: 1,
    eventoId: "EVT-2025-09-14-001",
    local: "Igreja Central",
    dataEvento: "14/09/2025",
    horario: "10:00",
    periodo: "Manhã",
    novidade: "Sim",
    score: 92,
    link: "#"
  },
  {
    id: "P-0123",
    nome: "Carlos Lima",
    tipo: "Regular",
    ultimaPresenca: "02/09/2025",
    totalPresencas: 9,
    eventoId: "EVT-2025-09-10-002",
    local: "Salão",
    dataEvento: "10/09/2025",
    horario: "20:00",
    periodo: "Noite",
    novidade: "Não",
    score: 97,
    link: "#"
  },
  {
    id: "P-0079",
    nome: "Desconhecido",
    tipo: "Regular",
    ultimaPresenca: "03/09/2025",
    totalPresencas: 5,
    eventoId: "EVT-2025-09-14-001",
    local: "Salão",
    dataEvento: "14/09/2025",
    horario: "14:00",
    periodo: "Tarde",
    novidade: "Não",
    score: 92,
    link: "#"
  }
];

const Relatorio = () => {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [local, setLocal] = useState("");
  const [tipoVisitante, setTipoVisitante] = useState("");
  const [frequencia, setFrequencia] = useState("");
  const [busca, setBusca] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const itemsPerPage = 10;

  // Função para definir datas rápidas
  const setQuickDate = (days: number) => {
    const hoje = new Date();
    const inicio = new Date();
    inicio.setDate(hoje.getDate() - days);
    
    setDataFim(hoje.toISOString().split('T')[0]);
    setDataInicio(inicio.toISOString().split('T')[0]);
  };

  // Dados filtrados e ordenados
  const filteredData = useMemo(() => {
    let data = mockData.filter(item => {
      const matchesBusca = busca === "" || 
        item.nome.toLowerCase().includes(busca.toLowerCase()) ||
        item.id.toLowerCase().includes(busca.toLowerCase());
      
      const matchesLocal = local === "" || local === "all" || item.local === local;
      const matchesTipo = tipoVisitante === "" || tipoVisitante === "all" || item.tipo === tipoVisitante;
      
      return matchesBusca && matchesLocal && matchesTipo;
    });

    // Ordenação
    if (sortField) {
      data = data.sort((a, b) => {
        let aValue = a[sortField as keyof typeof a];
        let bValue = b[sortField as keyof typeof b];
        
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = (bValue as string).toLowerCase();
        }
        
        if (sortDirection === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }

    return data;
  }, [busca, local, tipoVisitante, sortField, sortDirection]);

  // Paginação
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Função de ordenação
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Função para exportar CSV
  const exportCSV = () => {
    const headers = [
      "Pessoa ID", "Nome", "Tipo de Usuário", "Última Presença", "Total Presenças Últimos 90d",
      "Evento ID", "Local", "Data Evento", "Horário", "Detecção", "Periodo", "Novidade / Primeiro Evento",
      "Score (%)", "Link do Recorte do Rosto"
    ];
    
    const csvContent = headers.join(",");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "relatorio_presenca_modelo.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Cálculo dos totais
  const totals = useMemo(() => {
    return {
      presentes: filteredData.length,
      regulares: filteredData.filter(item => item.tipo === "Regular").length,
      novos: filteredData.filter(item => item.tipo === "Novo").length,
      desconhecidos: filteredData.filter(item => item.nome === "Desconhecido").length
    };
  }, [filteredData]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
              </Link>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-primary">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Relatório de Presença</h1>
                  <p className="text-sm text-muted-foreground">Análise detalhada de presenças</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Seção de Filtros */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold mb-6">Filtros</h2>
          
          {/* Filtros de Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Data Início</label>
              <Input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Data Fim</label>
              <Input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>
            <div className="lg:col-span-2">
              <label className="text-sm font-medium mb-2 block">Atalhos Rápidos</label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setQuickDate(7)}>
                  Últimos 7 dias
                </Button>
                <Button variant="outline" size="sm" onClick={() => setQuickDate(30)}>
                  Últimos 30 dias
                </Button>
                <Button variant="outline" size="sm" onClick={() => setQuickDate(90)}>
                  Últimos 90 dias
                </Button>
              </div>
            </div>
          </div>

          {/* Outros Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Local / Evento</label>
              <Select value={local} onValueChange={setLocal}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os locais" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os locais</SelectItem>
                  <SelectItem value="Igreja Central">Igreja Central</SelectItem>
                  <SelectItem value="Salão">Salão</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de Visitantes</label>
              <Select value={tipoVisitante} onValueChange={setTipoVisitante}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="Regular">Regulares</SelectItem>
                  <SelectItem value="Novo">Novos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Frequência de Presença</label>
              <Select value={frequencia} onValueChange={setFrequencia}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as frequências" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as frequências</SelectItem>
                  <SelectItem value="muito-regular">Muito regular (mais de 3/mês)</SelectItem>
                  <SelectItem value="regular">Regular (1-3/mês)</SelectItem>
                  <SelectItem value="raramente">Raramente (menos de 1/mês)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Busca por Nome ou ID</label>
              <Input
                placeholder="Nome ou ID..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Relatório de Presença */}
        <Card className="mb-8">
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Relatório de Presença</h2>
              </div>
              <Button onClick={exportCSV} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar Relatório
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-muted/50"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center gap-1">
                      Pessoa ID
                      {sortField === "id" && (
                        sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-muted/50"
                    onClick={() => handleSort("nome")}
                  >
                    <div className="flex items-center gap-1">
                      Nome
                      {sortField === "nome" && (
                        sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-muted/50"
                    onClick={() => handleSort("tipo")}
                  >
                    <div className="flex items-center gap-1">
                      Tipo de Usuário
                      {sortField === "tipo" && (
                        sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-muted/50"
                    onClick={() => handleSort("ultimaPresenca")}
                  >
                    <div className="flex items-center gap-1">
                      Última Presença
                      {sortField === "ultimaPresenca" && (
                        sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-muted/50"
                    onClick={() => handleSort("totalPresencas")}
                  >
                    <div className="flex items-center gap-1">
                      Total Presenças 90d
                      {sortField === "totalPresencas" && (
                        sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Evento ID</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Data Evento</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Novidade</TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-muted/50"
                    onClick={() => handleSort("score")}
                  >
                    <div className="flex items-center gap-1">
                      Score (%)
                      {sortField === "score" && (
                        sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Recorte do Rosto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono">{item.id}</TableCell>
                    <TableCell className="font-medium">{item.nome}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.tipo === "Regular" 
                          ? "bg-success/10 text-success" 
                          : "bg-accent/10 text-accent"
                      }`}>
                        {item.tipo}
                      </span>
                    </TableCell>
                    <TableCell>{item.ultimaPresenca || "-"}</TableCell>
                    <TableCell className="text-center">{item.totalPresencas}</TableCell>
                    <TableCell className="font-mono text-sm">{item.eventoId}</TableCell>
                    <TableCell>{item.local}</TableCell>
                    <TableCell>{item.dataEvento}</TableCell>
                    <TableCell>{item.horario}</TableCell>
                    <TableCell>{item.periodo}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.novidade === "Sim" 
                          ? "bg-warning/10 text-warning" 
                          : "bg-muted/30 text-muted-foreground"
                      }`}>
                        {item.novidade}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-medium">{item.score}%</TableCell>
                    <TableCell>
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-glow underline underline-offset-2"
                      >
                        Link
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-border/50">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </Card>

        {/* Footer com Totais */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Resumo</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totals.presentes}</div>
              <div className="text-sm text-muted-foreground">Total Presentes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{totals.regulares}</div>
              <div className="text-sm text-muted-foreground">Regulares</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{totals.novos}</div>
              <div className="text-sm text-muted-foreground">Novos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{totals.desconhecidos}</div>
              <div className="text-sm text-muted-foreground">Desconhecidos</div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Relatorio;