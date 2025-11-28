import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
            <div className="bg-muted/30 rounded-xl p-6 flex flex-col justify-start md:col-span-2 overflow-auto">
              <h1 className="text-2xl font-semibold mb-4">Análise exploratória</h1>

              <p className="text-sm text-muted-foreground mb-6">
                Nesta seção reunimos os gráficos gerados durante a análise exploratória
                do conjunto de dados sintético. Para cada figura há uma breve
                explicação do seu propósito e interpretação principal.
              </p>

              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-transparent border shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">Distribuição de Idade</CardTitle>
                      <CardDescription>
                        Visualização da distribuição etária dos clientes. Permite identificar a faixa de idade mais comum e detectar outliers.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <img src="/exploratory/age_distribution.png" alt="Age distribution" className="w-full rounded-md" />
                    </CardContent>
                  </Card>

                  <Card className="bg-transparent border shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">Sexo vs Risco de Crédito</CardTitle>
                      <CardDescription>
                        Análise comparativa do risco de crédito entre diferentes gêneros, permitindo avaliar se existe correlação entre essas variáveis.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <img src="/exploratory/sex_vs_risk.png" alt="Sex x Risk" className="w-full rounded-md" />
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-transparent border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Valor do Crédito vs Risco</CardTitle>
                    <CardDescription>
                      Relação entre o montante de crédito solicitado e o nível de risco. Ajuda a identificar se valores mais altos apresentam maior risco de inadimplência.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img src="/exploratory/credit_amount_vs_risk.png" alt="Credit amount vs Risk" className="w-full rounded-md" />
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-transparent border shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">Ocupação vs Risco de Crédito</CardTitle>
                      <CardDescription>
                        Distribuição do risco por tipo de ocupação profissional. Permite identificar quais setores apresentam maior ou menor risco de crédito.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <img src="/exploratory/jobs_vs_risk.png" alt="Jobs x Risk" className="w-full rounded-md" />
                    </CardContent>
                  </Card>

                  <Card className="bg-transparent border shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">Tempo de Emprego vs Risco</CardTitle>
                      <CardDescription>
                        Análise da relação entre estabilidade no emprego e risco de crédito. Tempo maior de emprego pode indicar maior estabilidade financeira.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <img src="/exploratory/employee_since_vs_risk.png" alt="Employee since vs Risk" className="w-full rounded-md" />
                    </CardContent>
                  </Card>

                  <Card className="bg-transparent border shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">Poupança vs Risco de Crédito</CardTitle>
                      <CardDescription>
                        Relação entre o volume de poupança e o risco de inadimplência. Clientes com mais reservas tendem a apresentar menor risco.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <img src="/exploratory/savings_vs_risk.png" alt="Savings x Risk" className="w-full rounded-md" />
                    </CardContent>
                  </Card>

                  <Card className="bg-transparent border shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">Conta Corrente vs Risco</CardTitle>
                      <CardDescription>
                        Análise do saldo em conta corrente em relação ao risco. Saldos mais altos geralmente indicam melhor capacidade de pagamento.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <img src="/exploratory/checking_account_vs_risk.png" alt="Checking account x Risk" className="w-full rounded-md" />
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-transparent border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Matriz de Correlação</CardTitle>
                    <CardDescription>
                      Visualização das correlações entre todas as variáveis numéricas do dataset. Permite identificar relações lineares entre features.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img src="/exploratory/correlation_matrix.png" alt="Correlation matrix" className="w-full rounded-md" />
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
