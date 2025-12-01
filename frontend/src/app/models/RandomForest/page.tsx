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
import { randomForestMetrics } from "@/data/model-metrics";

export default function Page() {
  // Use local metrics data - transform simplified structure to match MetricsTable expectations
  const cr = randomForestMetrics.classification_report;
  
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
              <h1 className="text-3xl font-bold mb-2">Random Forest</h1>
              <div className="text-sm ">
                <p className="mb-1 ">
                  &nbsp;&nbsp;O Random Forest implementa o conceito de ensemble learning através da técnica de bagging (bootstrap aggregating). O algoritmo constrói múltiplas árvores de decisão utilizando subconjuntos aleatórios dos dados de treinamento, combinando suas previsões através de votação majoritária (classificação) ou média (regressão). A aleatoriedade é introduzida tanto na seleção de amostras quanto na escolha de subconjuntos de features para cada divisão, reduzindo a correlação entre árvores individuais.
                </p>

                <h2 className="text-lg font-semibold mb-1 text-gray-800">
                  Vantagens
                </h2>

                <ul className="list-disc list-inside mb-3 ml-4">
                  <li><u>Robustez ao Overfitting:</u> A combinação de múltiplas árvores reduz significativamente a variância do modelo, melhorando a capacidade de generalização.</li>
                  <li><u>Análise de Importância de Features:</u> Fornece métricas quantitativas sobre a relevância de cada variável no processo decisório, auxiliando na seleção de features e interpretação de resultados.</li>
                  <li><u>Versatilidade:</u> Manuseia eficientemente dados tabulares heterogêneos, incluindo variáveis numéricas e categóricas, com tratamento nativo de valores ausentes</li>
                  <li><u>Paralelização Natural:</u> O treinamento de árvores individuais pode ser paralelizado, reduzindo o tempo de processamento</li>
                </ul>

                <h2 className="text-lg font-semibold mb-1 text-gray-800">
                  Desvantagens
                </h2>
                <ul className="list-disc list-inside mb-4 ml-4">
                  <li>Complexidade Computacional: Demanda recursos significativos de memória e processamento, especialmente com grandes volumes de dados e muitas árvores</li>
                  <li>Interpretabilidade Limitada: A natureza ensemble dificulta a compreensão intuitiva das regras de decisão, ao contrário de uma árvore de decisão única</li>
                  <li>Latência de Predição: Tempo de resposta mais elevado em produção devido à necessidade de agregação de múltiplas previsões</li>
                  <li>Tendência a Overfitting em Ruído: Embora mais robusto que árvores individuais, ainda pode capturar padrões espúrios em datasets com muito ruído</li>
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
                  matrix={randomForestMetrics.confusion_matrix}
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
                  src="/shap_feature_importance/randomForest.png"
                  alt="SHAP summary plot for random-forest"
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
