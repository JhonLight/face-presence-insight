import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, ArrowLeft, Search, Calendar, MapPin, Users, Filter, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for the table
const mockData = [
  {
    id: "FP001",
    nome: "João Silva",
    tipo: "Membro Regular",
    evento: "Culto Dominical",
    local: "Santuário Principal",
    dataHora: "2024-01-21 09:30",
    frequencia: "Alta",
    recorteRosto: "#"
  },
  {
    id: "FP002", 
    nome: "Maria Santos",
    tipo: "Visitante",
    evento: "Reunião de Oração",
    local: "Sala de Oração",
    dataHora: "2024-01-20 19:00",
    frequencia: "Baixa",
    recorteRosto: "#"
  },
  {
    id: "FP003",
    nome: "Pedro Costa",
    tipo: "Membro Regular", 
    evento: "Culto Dominical",
    local: "Santuário Principal",
    dataHora: "2024-01-21 09:30",
    frequencia: "Média",
    recorteRosto: "#"
  },
  {
    id: "FP004",
    nome: "Ana Oliveira",
    tipo: "Novo Convertido",
    evento: "Escola Bíblica",
    local: "Sala 1",
    dataHora: "2024-01-21 10:30",
    frequencia: "Média",
    recorteRosto: "#"
  },
  {
    id: "FP005",
    nome: "Carlos Mendes",
    tipo: "Visitante",
    evento: "Culto Jovem",
    local: "Auditório",
    dataHora: "2024-01-19 20:00",
    frequencia: "Baixa",
    recorteRosto: "#"
  }
];

const Relatorio = () => {
  const [filteredData, setFilteredData] = useState(mockData);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedLocal, setSelectedLocal] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("");
  const [selectedFrequencia, setSelectedFrequencia] = useState("");

  // Quick date presets
  const handleQuickDate = (preset: string) => {
    const today = new Date();
    let startDate = new Date();
    
    switch (preset) {
      case "hoje":
        startDate = today;
        break;
      case "7dias":
        startDate.setDate(today.getDate() - 7);
        break;
      case "30dias":
        startDate.setDate(today.getDate() - 30);
        break;
      case "90dias":
        startDate.setDate(today.getDate() - 90);
        break;
    }
    
    setDateFrom(startDate.toISOString().split('T')[0]);
    setDateTo(today.toISOString().split('T')[0]);
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = mockData.filter(item => {
      const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocal = !selectedLocal || item.local === selectedLocal;
      const matchesTipo = !selectedTipo || item.tipo === selectedTipo;
      const matchesFrequencia = !selectedFrequencia || item.frequencia === selectedFrequencia;
      
      return matchesSearch && matchesLocal && matchesTipo && matchesFrequencia;
    });
    
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  // Sorting
  const handleSort = (field: string) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    
    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[field as keyof typeof a];
      const bValue = b[field as keyof typeof b];
      
      if (direction === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredData(sorted);
  };

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Export CSV
  const exportCSV = () => {
    const headers = ["ID", "Nome", "Tipo", "Evento", "Local", "Data/Hora", "Frequência", "Recorte do Rosto"];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "modelo_relatorio_presenca.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFrequenciaBadge = (frequencia: string) => {
    const variants = {
      "Alta": "bg-success/10 text-success border-success/20",
      "Média": "bg-warning/10 text-warning border-warning/20", 
      "Baixa": "bg-destructive/10 text-destructive border-destructive/20"
    };
    return variants[frequencia as keyof typeof variants] || "bg-muted/10 text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
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
                  <p className="text-sm text-muted-foreground">Análise detalhada dos registros</p>
                </div>
              </div>
            </div>
            
            <Button onClick={exportCSV} className="gap-2">
              <Download className="h-4 w-4" />
              Exportar Relatório
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Filters Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros de Pesquisa
            </CardTitle>
            <CardDescription>
              Use os filtros abaixo para refinar sua análise de presença
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Date Filters */}
            <div>
              <label className="text-sm font-medium mb-3 block">Filtros Rápidos de Data</label>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={() => handleQuickDate("hoje")}>
                  Hoje
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleQuickDate("7dias")}>
                  Últimos 7 dias
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleQuickDate("30dias")}>
                  Últimos 30 dias
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleQuickDate("90dias")}>
                  Últimos 90 dias
                </Button>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Data Início
                </label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Data Fim
                </label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>

            {/* Other Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Local/Evento
                </label>
                <Select value={selectedLocal} onValueChange={setSelectedLocal}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os locais" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os locais</SelectItem>
                    <SelectItem value="Santuário Principal">Santuário Principal</SelectItem>
                    <SelectItem value="Sala de Oração">Sala de Oração</SelectItem>
                    <SelectItem value="Auditório">Auditório</SelectItem>
                    <SelectItem value="Sala 1">Sala 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Tipo de Visitante
                </label>
                <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os tipos</SelectItem>
                    <SelectItem value="Membro Regular">Membro Regular</SelectItem>
                    <SelectItem value="Visitante">Visitante</SelectItem>
                    <SelectItem value="Novo Convertido">Novo Convertido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Frequência</label>
                <Select value={selectedFrequencia} onValueChange={setSelectedFrequencia}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Média">Média</SelectItem>
                    <SelectItem value="Baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Buscar Nome/ID
                </label>
                <Input
                  placeholder="Digite nome ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={applyFilters} className="gap-2">
                <Filter className="h-4 w-4" />
                Aplicar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Registros de Presença</CardTitle>
            <CardDescription>
              Exibindo {currentData.length} de {filteredData.length} registros
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("id")}>
                      ID <ArrowUpDown className="h-4 w-4 inline ml-1" />
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("nome")}>
                      Nome <ArrowUpDown className="h-4 w-4 inline ml-1" />
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("tipo")}>
                      Tipo <ArrowUpDown className="h-4 w-4 inline ml-1" />
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("evento")}>
                      Evento <ArrowUpDown className="h-4 w-4 inline ml-1" />
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("local")}>
                      Local <ArrowUpDown className="h-4 w-4 inline ml-1" />
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("dataHora")}>
                      Data/Hora <ArrowUpDown className="h-4 w-4 inline ml-1" />
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("frequencia")}>
                      Frequência <ArrowUpDown className="h-4 w-4 inline ml-1" />
                    </TableHead>
                    <TableHead>Recorte do Rosto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono">{record.id}</TableCell>
                      <TableCell className="font-medium">{record.nome}</TableCell>
                      <TableCell>{record.tipo}</TableCell>
                      <TableCell>{record.evento}</TableCell>
                      <TableCell>{record.local}</TableCell>
                      <TableCell>{record.dataHora}</TableCell>
                      <TableCell>
                        <Badge className={getFrequenciaBadge(record.frequencia)}>
                          {record.frequencia}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <a 
                          href={record.recorteRosto} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Link
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredData.length)} de {filteredData.length} resultados
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <div className="text-sm font-medium">
                  {currentPage} de {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer with totals */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{filteredData.length}</div>
              <p className="text-xs text-muted-foreground">Total de Registros</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {filteredData.filter(r => r.tipo === "Membro Regular").length}
              </div>
              <p className="text-xs text-muted-foreground">Membros Regulares</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {filteredData.filter(r => r.tipo === "Visitante").length}
              </div>
              <p className="text-xs text-muted-foreground">Visitantes</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Relatorio;
