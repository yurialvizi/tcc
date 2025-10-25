"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ConfusionMatrix from "@/components/ConfusionMatrix";
import ClassificationMetricsTable from "@/components/MetricsTable";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle } from "lucide-react";
import API_CONFIG from "@/lib/api-config";

const fallbackMetrics = {};

export default function Page() {
  const [metricsData, setMetricsData] = useState<any>(fallbackMetrics);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [shapSummaryB64, setShapSummaryB64] = useState<string | null>(null);
  const [shapLoading, setShapLoading] = useState<boolean>(true);
  const [shapError, setShapError] = useState<string | null>(null);
  const [processedShapDataUrl, setProcessedShapDataUrl] = useState<string | null>(null);
  const [shapProcessing, setShapProcessing] = useState<boolean>(false);

  async function loadShap() {
    setShapLoading(true);
    setShapError(null);
    try {
      const res = await fetch(`${API_CONFIG.SHAP_BASE_URL}/shap/plots/random-forest`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setShapSummaryB64(data?.summary_plot ?? null);
    } catch (err: any) {
      console.error("Error loading SHAP summary:", err);
      setShapError(err?.message || String(err));
    } finally {
      setShapLoading(false);
    }
  }

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_CONFIG.SHAP_BASE_URL}/metrics/random-forest`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      if (data && data.classification_report) {
        const cr = data.classification_report;

        const classKeys = Object.keys(cr).filter(
          (k) => k !== "accuracy" && k !== "macro avg" && k !== "weighted avg"
        );

        const classMetrics = classKeys.map((k) => {
          const entry = cr[k] || {};
          return {
            class: String(k),
            precision: Number(entry.precision ?? entry["precision"] ?? 0),
            recall: Number(entry.recall ?? entry["recall"] ?? 0),
            f1score: Number(entry["f1-score"] ?? entry.f1score ?? 0),
            support: Number(entry.support ?? entry["support"] ?? 0),
          };
        });

        const mapped = {
          classMetrics,
          accuracy: Number(cr.accuracy ?? 0),
          macroAvg: {
            precision: Number(
              cr["macro avg"]?.precision ?? cr["macro avg"]?.["precision"] ?? 0
            ),
            recall: Number(
              cr["macro avg"]?.recall ?? cr["macro avg"]?.["recall"] ?? 0
            ),
            f1score: Number(
              cr["macro avg"]?.["f1-score"] ?? cr["macro avg"]?.f1score ?? 0
            ),
          },
          weightedAvg: {
            precision: Number(
              cr["weighted avg"]?.precision ??
                cr["weighted avg"]?.["precision"] ??
                0
            ),
            recall: Number(
              cr["weighted avg"]?.recall ?? cr["weighted avg"]?.["recall"] ?? 0
            ),
            f1score: Number(
              cr["weighted avg"]?.["f1-score"] ??
                cr["weighted avg"]?.f1score ??
                0
            ),
          },
        };

        setMetricsData(mapped);

      } else {
        setMetricsData(fallbackMetrics);
        setError("Resposta inválida da API — usando valores padrão.");
      }
    } catch (err: any) {
      console.error("Error loading metrics:", err);
      setMetricsData(fallbackMetrics);
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    loadShap();
  }, []);

  useEffect(() => {
    if (!shapSummaryB64) {
      setProcessedShapDataUrl(null);
      return;
    }

    let cancelled = false;

    async function processBackgroundToTransparent(base64: string) {
      setShapProcessing(true);
      try {
        await new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              if (!ctx) return reject(new Error('Canvas not supported'));
              ctx.drawImage(img, 0, 0);
              try {
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;
                const threshold = 250;
                for (let i = 0; i < data.length; i += 4) {
                  const r = data[i];
                  const g = data[i + 1];
                  const b = data[i + 2];
                  if (r >= threshold && g >= threshold && b >= threshold) {
                    data[i + 3] = 0;
                  }
                }
                ctx.putImageData(imgData, 0, 0);
              } catch (e) {
                console.warn('Could not access image data to make background transparent', e);
              }

              const processed = canvas.toDataURL('image/png');
              if (!cancelled) setProcessedShapDataUrl(processed);
              resolve();
            } catch (e) {
              reject(e);
            }
          };
          img.onerror = (ev) => reject(new Error('Failed to load SHAP image'));
          img.src = `data:image/png;base64,${base64}`;
        });
      } catch (err) {
        console.error('Error processing SHAP image for transparency:', err);
        setProcessedShapDataUrl(null);
      } finally {
        if (!cancelled) setShapProcessing(false);
      }
    }

    processBackgroundToTransparent(shapSummaryB64);

    return () => {
      cancelled = true;
    };
  }, [shapSummaryB64]);

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
                {loading ? (
                  <div className="p-4">Carregando métricas...</div>
                ) : error ? (
                  <div className="p-6">
                    <div className="text-red-600 mb-2">Erro: {error}</div>
                    <button className="btn" onClick={() => load()}>
                      Tentar novamente
                    </button>
                    <div className="mt-3">Mostrando dados padrão.</div>
                    <ClassificationMetricsTable metrics={metricsData} />
                  </div>
                ) : (
                  <ClassificationMetricsTable metrics={metricsData} />
                )}
              </div>

              <div className="bg-muted/30 rounded-xl p-4 flex flex-col items-start flex-1">
                <h1 className="text-3xl font-bold ml-2">Matriz de Confusão</h1>
                <ConfusionMatrix
                  labels={["Good", "Bad"]}
                  modelName="random-forest"
                />
              </div>
            </div>
          </div>
          <div className="bg-muted/30 rounded-xl p-6 flex flex-col justify-start">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold mb-2">Feature Importance</h1>
            </div>

            {shapLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="animate-spin mr-2" />
                <span>Carregando gráfico SHAP...</span>
              </div>
            ) : shapError ? (
              <div className="text-center py-8 text-destructive">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Erro ao carregar gráfico SHAP: {shapError}</p>
              </div>
            ) : shapSummaryB64 ? (
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
                  {shapProcessing && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
                      <div className="text-white">Processando imagem...</div>
                    </div>
                  )}
                  <img
                    src={processedShapDataUrl ?? `data:image/png;base64,${shapSummaryB64}`}
                    alt={`SHAP summary plot for random-forest`}
                    className="h-auto object-contain md:w-[120%]"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum gráfico SHAP disponível para este modelo.</p>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
