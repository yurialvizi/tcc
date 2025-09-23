import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

export default function Page() {
  return (
      <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </header>
        <div>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-[calc(100vh-4rem)]">
            <div className="bg-muted/50 rounded-xl p-6 flex flex-col justify-start md:col-span-2 overflow-auto">
              <h1 className="text-2xl font-semibold mb-4">Análise exploratória</h1>

              <p className="text-sm text-muted-foreground mb-6">
                Nesta seção reunimos os gráficos gerados durante a análise exploratória
                do conjunto de dados sintético. Para cada figura há uma breve
                explicação do seu propósito e interpretação principal.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Age distribution */}
                <Card>
                  <CardContent>
                    <h3 className="text-lg font-medium mb-2">1. Age distribution</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Distribuição de clientes por faixa etária. A barra mostra o
                      número de clientes em cada faixa; a linha indica a porcentagem
                      de clientes de risco "bad" (maior valor indica maior proporção
                      de clientes ruins naquela faixa).
                    </p>
                    <img src="/exploratory/age_distribution.png" alt="Age distribution" className="w-full rounded-md shadow-sm" />
                  </CardContent>
                </Card>

                {/* 2. Sex x Risk */}
                <Card>
                  <CardContent>
                    <h3 className="text-lg font-medium mb-2">2. Sex x Risk</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Comparação entre os sexos quanto à proporção de risco.
                      Ajuda a identificar se existe uma diferença significativa
                      entre homens e mulheres na taxa de clientes de risco "bad".
                    </p>
                    <img src="/exploratory/sex_vs_risk.png" alt="Sex x Risk" className="w-full rounded-md shadow-sm" />
                  </CardContent>
                </Card>

                {/* 3. Credit amount x Risk */}
                <Card>
                  <CardContent>
                    <h3 className="text-lg font-medium mb-2">3. Credit amount x Risk</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Relação entre o montante de crédito e a presença de risco.
                      O gráfico combina a percentagem de clientes ruins por intervalo
                      de crédito com a participação acumulada desses casos, e marca
                      o ponto onde ~80% dos clientes ruins são concentrados.
                    </p>
                    <img src="/exploratory/credit_amount_vs_risk.png" alt="Credit amount vs Risk" className="w-full rounded-md shadow-sm" />
                  </CardContent>
                </Card>

                {/* 4. Jobs x Risk */}
                <Card>
                  <CardContent>
                    <h3 className="text-lg font-medium mb-2">4. Jobs x Risk</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Distribuição de risco por categoria de emprego. Permite
                      observar quais tipos de ocupação apresentam maior proporção
                      de clientes de risco "bad".
                    </p>
                    <img src="/exploratory/jobs_vs_risk.png" alt="Jobs x Risk" className="w-full rounded-md shadow-sm" />
                  </CardContent>
                </Card>

                {/* 5. Employee since x Risk */}
                <Card>
                  <CardContent>
                    <h3 className="text-lg font-medium mb-2">5. Employee since x Risk</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Relação entre tempo de emprego atual e risco. Categorias de
                      tempo no emprego são comparadas quanto à proporção de clientes
                      considerados de risco "bad".
                    </p>
                    <img src="/exploratory/employee_since_vs_risk.png" alt="Employee since vs Risk" className="w-full rounded-md shadow-sm" />
                  </CardContent>
                </Card>

                {/* 6. Savings x Risk */}
                <Card>
                  <CardContent>
                    <h3 className="text-lg font-medium mb-2">6. Savings x Risk</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Mostra a porcentagem de clientes de risco segundo faixas de
                      poupança. Pode revelar se clientes com menor poupança têm
                      maior probabilidade de serem classificados como "bad".
                    </p>
                    <img src="/exploratory/savings_vs_risk.png" alt="Savings x Risk" className="w-full rounded-md shadow-sm" />
                  </CardContent>
                </Card>

                {/* 7. Checking account x Risk */}
                <Card>
                  <CardContent>
                    <h3 className="text-lg font-medium mb-2">7. Checking account x Risk</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Avalia o impacto do estado da conta corrente no risco do cliente.
                      Categorias como sem conta, saldo negativo ou diferentes faixas
                      são comparadas.
                    </p>
                    <img src="/exploratory/checking_account_vs_risk.png" alt="Checking account x Risk" className="w-full rounded-md shadow-sm" />
                  </CardContent>
                </Card>

                {/* 8. Correlation Matrix */}
                <Card>
                  <CardContent>
                    <h3 className="text-lg font-medium mb-2">8. Correlation Matrix</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Matriz de correlação entre variáveis numéricas (após pré-processamento).
                      Útil para identificar multicolinearidade ou associações entre
                      features que podem afetar modelos preditivos.
                    </p>
                    <img src="/exploratory/correlation_matrix.png" alt="Correlation matrix" className="w-full rounded-md shadow-sm" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
