"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ConfusionMatrix from "@/components/ConfusionMatrix";
import ClassificationMetricsTable from "@/components/MetricsTable";
import { mlpMetrics } from "@/data/model-metrics";

export default function Page() {
  // Use local metrics data - transform simplified structure to match MetricsTable expectations
  const cr = mlpMetrics.classification_report;
  
  const metricsData = {
    classMetrics: [{
      class: "1",
      precision: cr.precision,
      recall: cr.recall,
      f1score: cr.f1score,
      specificity: cr.specificity,
      training_time: cr.training_time,
    }],
    accuracy: cr.accuracy,
    macroAvg: {
      precision: cr.precision,
      recall: cr.recall,
      f1score: cr.f1score,
      specificity: cr.specificity,
      training_time: cr.training_time,
    },
    weightedAvg: {
      precision: cr.precision,
      recall: cr.recall,
      f1score: cr.f1score,
      specificity: cr.specificity,
      training_time: cr.training_time,
    },
  };

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
          <div className="grid gap-4 md:grid-cols-3 h-full">
            <div className="bg-muted/30 rounded-xl p-6 flex flex-col justify-start md:col-span-2">
              <h1 className="text-3xl font-bold mb-2">MLP</h1>
              <div className="text-sm ">
                <p className="mb-1 ">
                  &nbsp;&nbsp;O MLP constitui uma arquitetura de rede neural artificial feed-forward composta por múltiplas camadas de neurônios artificiais. A camada de entrada recebe os features do problema (idade, renda, histórico creditício), as camadas ocultas processam essas informações através de funções de ativação não-lineares (ReLU, sigmoid, tanh), e a camada de saída produz a classificação final. O aprendizado ocorre via algoritmo de backpropagation, que ajusta iterativamente os pesos das conexões baseado no erro de predição calculado através de gradient descent.
                </p>

                <h2 className="text-lg font-semibold mb-1 text-gray-800">
                  Vantagens
                </h2>

                <ul className="list-disc list-inside mb-3 ml-4">
                  <li>Capacidade de modelagem não-linear: Excelente habilidade para capturar padrões complexos e interações não-triviais entre variáveis.</li>
                  <li>Versatilidade de aplicação: Adaptável a diversos tipos de problemas, incluindo classificação multiclasse, regressão e previsão de séries temporais.</li>
                  <li>Aproximação universal: Teoricamente capaz de aproximar qualquer função contínua com arquitetura adequada.</li>
                  <li>Escalabilidade: Performance melhora com o aumento do volume de dados de treinamento.</li>
                </ul>

                <h2 className="text-lg font-semibold mb-1 text-gray-800">
                  Desvantagens
                </h2>
                <ul className="list-disc list-inside mb-4 ml-4">
                  <li>Intensidade computacional: Requer recursos computacionais substanciais, frequentemente necessitando GPUs para treinamento eficiente.</li>
                  <li>Complexidade de configuração: Demanda ajuste cuidadoso de arquitetura (número de camadas e neurônios), taxa de aprendizado, regularização e outras configurações.</li>
                  <li>Propensão ao overfitting: Especialmente problemático em datasets pequenos, onde a rede pode memorizar padrões específicos sem generalizar adequadamente.</li>
                  <li>Interpretabilidade limitada: Funciona como uma "caixa preta", dificultando a compreensão dos fatores que influenciam decisões específicas.</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-4 h-full">
              <div className="bg-muted/30 rounded-xl p-4 flex flex-col items-start flex-1">
                <h1 className="text-3xl font-bold mb-1 ml-2">Métricas</h1>
                <ClassificationMetricsTable metrics={metricsData} />
              </div>

              <div className="bg-muted/30 rounded-xl p-4 flex flex-col items-start flex-1">
                <h1 className="text-3xl font-bold ml-2">Matriz de Confusão</h1>
                <ConfusionMatrix
                  labels={["Good", "Bad"]}
                  matrix={mlpMetrics.confusion_matrix}
                />
              </div>
            </div>
          </div>
          <div className="bg-muted/30 rounded-xl p-6 flex flex-col justify-start">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold mb-2">Feature Importance</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="text-sm text-muted-foreground order-1 md:order-1">
                <h3 className="text-lg font-semibold mb-2">O que é este gráfico?</h3>
                <p className="mb-2">
                  O gráfico de summary do SHAP mostra a importância média das features para o modelo. Cada ponto
                  representa uma observação e sua contribuição para a predição; pontos à direita aumentam a probabilidade
                  da classe positiva, enquanto pontos à esquerda diminuem.
                </p>
                <p className="mb-1">
                  As cores normalmente representam o valor da feature (alto/baixo). Este gráfico dá uma visão global da
                  importância e direção do efeito das variáveis.
                </p>
              </div>

              <div className="order-2 md:order-2 rounded-lg p-2 bg-muted/30 flex items-center justify-center overflow-visible min-h-[360px] relative">
                <img
                  src="/shap_feature_importance/mlp.png"
                  alt="SHAP summary plot for mlp"
                  className="h-auto object-contain md:w-[120%]"
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
