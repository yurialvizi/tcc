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
    { class: '0', precision: 0.86, recall: 0.85, f1score: 0.85, support: 60005 },
    { class: '1', precision: 0.93, recall: 0.94, f1score: 0.93, support: 139995 }
  ],
  accuracy: 0.91,
  macroAvg: { precision: 0.90, recall: 0.89, f1score: 0.90 },
  weightedAvg: { precision: 0.91, recall: 0.91, f1score: 0.91 }
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
              <h1 className="text-3xl font-bold mb-2">XgBoost</h1>
              <div className="text-sm ">
            <p className="mb-1">
                O <strong>XGBoost (eXtreme Gradient Boosting)</strong> é uma técnica de aprendizado supervisionado que utiliza árvores de decisão com reforço gradativo, onde cada árvore subsequente é construída para corrigir os erros das anteriores, minimizando os resíduos através da otimização de uma função de perda.
            </p>
            
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Funcionamento - Boosting</h2>
            <p className="mb-1">O <strong>boosting</strong> é um método que combina várias árvores de decisão fracas sequencialmente:</p>
            <ul className="list-disc list-inside mb-1 ml-4">
                <li>Atribui pesos às saídas de árvores individuais</li>
                <li>Dá maior peso às classificações incorretas da árvore anterior</li>
                <li>Cada novo modelo corrige os erros dos modelos anteriores</li>
            </ul>

            <h2 className="text-lg font-semibold mb-1 text-gray-800">Processo de Treinamento</h2>
            <p className="mb-1">
                Durante o treinamento, o modelo ajusta os pesos das observações e utiliza técnicas de regularização para evitar overfitting e melhorar a generalização dos dados. A predição final combina todas as árvores através de média (regressão) ou votação (classificação).
            </p>
            
            <h2 className="text-lg font-semibold mb-1 text-gray-800">Principais Características</h2>
            
            <p className="mb-1"><strong>Vantagens:</strong></p>
            <ul className="list-disc list-inside mb-1 ml-4">
                <li>Alta eficiência computacional com paralelização</li>
                <li>Regularização integrada previne overfitting</li>
                <li>Permite ajustes finos de hiperparâmetros</li>
                <li>Suporte a diferentes tipos de dados</li>
                <li>Alta precisão nas predições</li>
            </ul>
            
            <p className="mb-1"><strong>Desvantagens:</strong></p>
            <ul className="list-disc list-inside mb-1 ml-4">
                <li>Necessidade de ajuste fino dos hiperparâmetros</li>
                <li>Maior custo computacional comparado a modelos simples</li>
            </ul>

        </div>
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
                    [85, 15],
                    [6, 94],
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