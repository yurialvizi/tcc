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
            <div className="bg-muted/30 rounded-xl p-6 flex flex-col justify-start md:col-span-2 overflow-auto">
              <h1 className="text-2xl font-semibold mb-4">Análise exploratória</h1>

              <p className="text-sm text-muted-foreground mb-6">
                Nesta seção reunimos os gráficos gerados durante a análise exploratória
                do conjunto de dados sintético. Para cada figura há uma breve
                explicação do seu propósito e interpretação principal.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/30">
                <Card className="bg-muted/30">
                  <CardContent>
                    <img src="/exploratory/age_distribution.png" alt="Age distribution" className="w-full rounded-md" />
                  </CardContent>
                </Card>

                <Card className="bg-muted/30">
                  <CardContent>
                    <img src="/exploratory/sex_vs_risk.png" alt="Sex x Risk" className="w-full rounded-md" />
                  </CardContent>
                </Card>

                <Card className="bg-muted/30">
                  <CardContent>
                    <img src="/exploratory/credit_amount_vs_risk.png" alt="Credit amount vs Risk" className="w-full rounded-md" />
                  </CardContent>
                </Card>

                <Card className="bg-muted/30">
                  <CardContent>
                    <img src="/exploratory/jobs_vs_risk.png" alt="Jobs x Risk" className="w-full rounded-md" />
                  </CardContent>
                </Card>

                <Card className="bg-muted/30">
                  <CardContent>
                    <img src="/exploratory/employee_since_vs_risk.png" alt="Employee since vs Risk" className="w-full rounded-md" />
                  </CardContent>
                </Card>

                <Card className="bg-muted/30">
                  <CardContent>
                    <img src="/exploratory/savings_vs_risk.png" alt="Savings x Risk" className="w-full rounded-md" />
                  </CardContent>
                </Card>

                <Card className="bg-muted/30">
                  <CardContent>
                    <img src="/exploratory/checking_account_vs_risk.png" alt="Checking account x Risk" className="w-full rounded-md" />
                  </CardContent>
                </Card>

                <Card className="bg-muted/30">
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
