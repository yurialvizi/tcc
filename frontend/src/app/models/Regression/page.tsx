import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ConfusionMatrix from "@/components/ConfusionMatrix";
import ClassificationMetricsTable from "@/components/MetricsTable";

const metricsData = {
  classMetrics: [
    { class: '0', precision: 0.59, recall: 0.28, f1score: 0.38, support: 60005 },
    { class: '1', precision: 0.75, recall: 0.92, f1score: 0.82, support: 139995 }
  ],
  accuracy: 0.73,
  macroAvg: { precision: 0.67, recall: 0.60, f1score: 0.60 },
  weightedAvg: { precision: 0.70, recall: 0.73, f1score: 0.69 }
};

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-[calc(100vh-4rem)]">
          <div className="grid gap-4 md:grid-cols-2 h-full">
            {/* Texto do lado esquerdo */}
            <div className="bg-muted/50 rounded-xl p-6 flex flex-col justify-start">
              <h1 className="text-4xl font-bold mb-2">Regressão Logística</h1>
              <p className="text-sm text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                blandit metus ac tellus fermentum, at interdum nulla bibendum.
              </p>
            </div>
            
            {/* Coluna direita com métricas e matriz empilhadas */}
            <div className="flex flex-col gap-4 h-full">
              {/* Métricas */}
              <div className="bg-muted/50 rounded-xl p-4 flex flex-col items-start flex-1">
                <h1 className="text-3xl font-bold mb-1 ml-2">Métricas</h1>
                <ClassificationMetricsTable 
                  metrics={metricsData}
                />
              </div>
              
              {/* Matriz de Confusão */}
              <div className="bg-muted/50 rounded-xl p-4 flex flex-col items-start flex-1">
                <h1 className="text-3xl font-bold ml-2">Matriz de Confusão</h1>
                <ConfusionMatrix
                  labels={["Good", "Bad"]}
                  matrix={[
                    [28, 72],
                    [8, 92],
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}