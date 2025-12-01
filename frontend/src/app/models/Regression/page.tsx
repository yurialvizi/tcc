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
import { logisticRegressionMetrics } from "@/data/model-metrics";

const fallbackMetrics = {};

export default function Page() {
  // Use local metrics data - transform simplified structure to match MetricsTable expectations
  const cr = logisticRegressionMetrics.classification_report;
  
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
              <h1 className="text-3xl font-bold mb-2">Regressão Logística</h1>
              <div className="text-sm ">
                <p className="mb-1 ">
                  &nbsp;&nbsp;A Regressão Logística é um modelo estatístico fundamental para problemas de classificação binária e multiclasse. O algoritmo utiliza uma combinação linear das variáveis independentes, aplicando posteriormente a função sigmoide para transformar o resultado em probabilidades no intervalo [0,1]. No contexto de concessão de crédito, essa probabilidade representa a chance de um cliente ser classificado como "bom pagador" ou "mau pagador". O modelo otimiza seus coeficientes através do método da máxima verossimilhança, minimizando sistematicamente a divergência entre previsões e valores observados.

                </p>

                <h2 className="text-lg font-semibold mb-1 text-gray-800">
                  Vantagens
                </h2>

                <ul className="list-disc list-inside mb-3 ml-4">
                  <li>Interpretabilidade superior: Os coeficientes fornecem insights claros sobre a influência de cada variável, permitindo compreender como fatores como renda, histórico creditício e tempo de emprego impactam a decisão de crédito.</li>
                  <li>Eficiência computacional: Algoritmo de treinamento rápido, adequado para processamento de grandes volumes de dados com recursos computacionais limitados.</li>
                  <li>Saídas probabilísticas: Além da classificação binária, fornece probabilidades associadas às previsões, facilitando a calibração de políticas de risco e definição de pontos de corte.</li>
                  <li>Estabilidade: Menos propenso a overfitting em comparação com algoritmos mais complexos.</li>
                </ul>

                <h2 className="text-lg font-semibold mb-1 text-gray-800">
                  Desvantagens
                </h2>
                <ul className="list-disc list-inside mb-4 ml-4">
                  <li>Limitação de linearidade: Assume relação linear entre variáveis independentes e o logit da variável dependente, restringindo sua aplicação em cenários com interações complexas.</li>
                  <li>Performance limitada em dados não-lineares: Pode apresentar acurácia inferior quando padrões de comportamento apresentam relações não-lineares complexas.</li>
                  <li>Sensibilidade a outliers: Valores extremos podem distorcer significativamente os coeficientes do modelo.</li>
                  <li>Necessidade de pré-processamento: Requer tratamento cuidadoso de variáveis categóricas e normalização de features numéricas.</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-4 h-full">
              <div className="bg-muted/30 rounded-xl p-4 flex flex-col items-start flex-1 center">
                <h1 className="text-3xl font-bold mb-1 ml-2">Métricas</h1>
                <ClassificationMetricsTable metrics={metricsData} />
              </div>

              <div className="bg-muted/30 rounded-xl p-4 flex flex-col items-start flex-1">
                <h1 className="text-3xl font-bold ml-2">Matriz de Confusão</h1>
                <ConfusionMatrix
                  labels={["Good", "Bad"]}
                  matrix={logisticRegressionMetrics.confusion_matrix}
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
                  src="/shap_feature_importance/logisticRegression.png"
                  alt="SHAP summary plot for logistic-regression"
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
