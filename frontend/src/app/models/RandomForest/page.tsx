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
    {
      class: "0",
      precision: 0.85,
      recall: 0.84,
      f1score: 0.84,
      support: 60005,
    },
    {
      class: "1",
      precision: 0.93,
      recall: 0.94,
      f1score: 0.93,
      support: 139995,
    },
  ],
  accuracy: 0.91,
  macroAvg: { precision: 0.89, recall: 0.89, f1score: 0.89 },
  weightedAvg: { precision: 0.91, recall: 0.91, f1score: 0.91 },
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
              <h1 className="text-3xl font-bold mb-2">Random Forest</h1>
              <div className="text-sm ">
                <p className="mb-1">
                  O <strong>Random Forest</strong> é um algoritmo de aprendizado
                  de máquina que combina múltiplas árvores de decisão para
                  produzir previsões mais precisas e robustas.
                </p>

                <h2 className="text-lg font-semibold mb-1 text-gray-800">
                  Funcionamento
                </h2>
                <p className="mb-1">Baseia-se em dois conceitos principais:</p>

                <p className="mb-1">
                  <strong>Bagging:</strong> Criação de múltiplas amostras
                  aleatórias do conjunto de dados original, onde cada amostra
                  treina uma árvore independente.
                </p>

                <p className="mb-1">
                  <strong>Árvores de Decisão:</strong> Estruturas hierárquicas
                  que fazem divisões sucessivas dos dados através de testes
                  condicionais até chegar aos resultados finais.
                </p>

                <p className="mb-1">
                  O algoritmo seleciona aleatoriamente tanto os dados quanto as
                  variáveis para cada árvore, reduzindo a correlação entre elas.
                  A predição final é obtida pela agregação dos resultados de
                  todas as árvores.
                </p>

                <h2 className="text-lg font-semibold mb-1 text-gray-800">
                  Principais Características
                </h2>

                <p className="mb-1">
                  <strong>Vantagens:</strong>
                </p>
                <ul className="list-disc list-inside mb-3 ml-4">
                  <li>Reduz significativamente o overfitting</li>
                  <li>Permite avaliar a importância das variáveis</li>
                  <li>Maior robustez e estabilidade nas predições</li>
                </ul>

                <p className="mb-1">
                  <strong>Desvantagens:</strong>
                </p>
                <ul className="list-disc list-inside mb-4 ml-4">
                  <li>Maior complexidade computacional</li>
                  <li>
                    Menor interpretabilidade comparado a uma árvore individual
                  </li>
                </ul>

              </div>
            </div>

            {/* Coluna direita com métricas e matriz empilhadas */}
            <div className="flex flex-col gap-4 h-full">
              {/* Métricas */}
              <div className="bg-muted/50 rounded-xl p-4 flex flex-col items-start flex-1">
                <h1 className="text-3xl font-bold mb-1 ml-2">Métricas</h1>
                <ClassificationMetricsTable metrics={metricsData} />
              </div>

              {/* Matriz de Confusão */}
              <div className="bg-muted/50 rounded-xl p-4 flex flex-col items-start flex-1">
                <h1 className="text-3xl font-bold ml-2">Matriz de Confusão</h1>
                <ConfusionMatrix
                  labels={["Good", "Bad"]}
                  matrix={[
                    [84, 16],
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
