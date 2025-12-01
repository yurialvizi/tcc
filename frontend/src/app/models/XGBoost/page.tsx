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
import { xgBoostMetrics } from "@/data/model-metrics";

export default function Page() {
  // Use local metrics data - transform simplified structure to match MetricsTable expectations
  const cr = xgBoostMetrics.classification_report;
  
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
              <h1 className="text-3xl font-bold mb-2">XGBoost</h1>
              <div className="text-sm ">
                <p className="mb-1 ">
                  &nbsp;&nbsp;O XGBoost (Extreme Gradient Boosting) é uma implementação do algoritmo de gradient boosting, que constrói árvores de decisão de forma sequencial, em que cada nova árvore é treinada para corrigir os erros residuais das anteriores, ajustando o modelo por meio do gradiente descendente aplicado a uma função de perda. Diferencia-se por incorporar mecanismos avançados de regularização (L1 e L2), que ajudam a controlar a complexidade e evitar o overfitting, além de um processo de pruning inteligente que elimina divisões pouco relevantes.
                </p>

                <h2 className="text-lg font-semibold mb-1 text-gray-800">
                  Vantagens
                </h2>

                <ul className="list-disc list-inside mb-3 ml-4">
                  <li>Performance superior: Frequentemente alcança os melhores resultados em métricas como AUC-ROC, precisão e F1-score em problemas de classificação de crédito.</li>
                  <li>Otimização avançada: Implementa técnicas sofisticadas de otimização, incluindo second-order approximation e column block for parallel learning.</li>
                  <li>Flexibilidade de configuração: Oferece extensa gama de hiperparâmetros para ajuste fino, permitindo adaptação a diferentes características dos dados.</li>
                  <li>Tratamento de missing values: Manuseia automaticamente valores ausentes através de algoritmos de split inteligente.</li>
                </ul>

                <h2 className="text-lg font-semibold mb-1 text-gray-800">
                  Desvantagens
                </h2>
                <ul className="list-disc list-inside mb-4 ml-4">
                  <li>Complexidade de Tuning: Requer expertise técnica considerável para otimização adequada dos hiperparâmetros e prevenção de overfitting.</li>
                  <li>Demanda computacional: Alto consumo de memória e processamento, especialmente em datasets grandes com muitas iterações.</li>
                  <li>Interpretabilidade desafiadora: Embora existam ferramentas como SHAP values, explicar decisões individuais permanece complexo.</li>
                  <li>Sensibilidade a ruído: Pode ser propenso a overfitting em dados com alta dimensionalidade e ruído significativo.</li>
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
                  matrix={xgBoostMetrics.confusion_matrix}
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
                  src="/shap_feature_importance/xgboost.png"
                  alt="SHAP summary plot for xg-boost"
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
