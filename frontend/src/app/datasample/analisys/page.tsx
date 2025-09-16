import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ChartBarDefault from "./grafico"

export default function Page() {
  return (
    <div className="h-screen flex flex-col">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 min-h-0">
          <header className="flex h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 min-h-0">
            <Tabs defaultValue="overview" className="w-full flex-1 flex flex-col min-h-0">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="age">Idade</TabsTrigger>
                <TabsTrigger value="sex">Sexo</TabsTrigger>
                <TabsTrigger value="qnt_credit">Quantidade de Crédito</TabsTrigger>
                <TabsTrigger value="work">Tipo de Trabalho</TabsTrigger>
                <TabsTrigger value="time_working">Tempo de Emprego</TabsTrigger>
                <TabsTrigger value="savings">Poupança</TabsTrigger>
                <TabsTrigger value="account">Conta Corrente</TabsTrigger>
              </TabsList>

              <TabsContent value="age" className="flex-1 flex flex-col min-h-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  <div className="bg-muted/50 rounded-xl p-6 flex flex-col items-start h-full">
                    <h1 className="text-4xl font-bold mb-2">Gráfico Risco por Sexo</h1>
                    <div className="flex-1 w-full mt-2">
                      <ChartBarDefault />
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-6 flex flex-col items-start h-full">
                    <h1 className="text-4xl font-bold mb-2">Matriz de Confusão</h1>
                    <p className="text-muted-foreground">Análise detalhada da performance do modelo</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sex" className="flex-1 flex flex-col min-h-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  <div className="bg-muted/50 rounded-xl p-6 flex flex-col items-start h-full">
                    <h1 className="text-4xl font-bold mb-2">Gráficos</h1>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-6 flex flex-col items-start h-full">
                    <h1 className="text-4xl font-bold mb-2">Tendências</h1>
                    <p className="text-muted-foreground">Análise temporal dos resultados</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="qnt_credito" className="flex-1 flex flex-col min-h-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  <div className="bg-muted/50 rounded-xl p-6 flex flex-col items-start h-full">
                    <h1 className="text-4xl font-bold mb-2">Relatórios</h1>
                    <p className="text-muted-foreground">Relatórios detalhados e exportáveis</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-6 flex flex-col items-start h-full">
                    <h1 className="text-4xl font-bold mb-2">Histórico</h1>
                    <p className="text-muted-foreground">Acompanhe o histórico de execuções</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}