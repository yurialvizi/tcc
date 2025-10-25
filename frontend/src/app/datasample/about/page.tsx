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
      const res = await fetch(`${API_CONFIG.SHAP_BASE_URL}/shap/plots/mlp`);
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
      const res = await fetch(`${API_CONFIG.SHAP_BASE_URL}/metrics/mlp`);
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
          <div className="grid gap-4 md:grid-cols-5 h-full">
            <div className="bg-muted/30 rounded-xl p-6 flex flex-col justify-start md:col-span-3">
              <p className="mb-2 indent-paragraph">
                &nbsp;&nbsp;O dataset base do trabalho é o Statlog (German Credit Data),
                desenvolvido por Hans Hofmann (1994), amplamente utilizado em
                estudos de risco de crédito. Ele contém 1000 registros de
                clientes de um banco alemão, cada um classificado como bom
                pagador ou mau pagador, com base em seu histórico e
                características socioeconômicas.
              </p>
              <p>
                &nbsp;&nbsp;O conjunto de dados é composto por 20 atributos, incluindo
                informações categóricas, ordinais e numéricas. A classificação
                binária divide os clientes em duas categorias:
              </p>
              <ul className="list-disc list-inside mb-2 ml-4 mt-2">
                <li>Classe 1 (Bom Pagador): 700 registros (70%).</li>
                <li>Classe 0 (Mau Pagador): 300 registros (30%)</li>
              </ul>
              <h1 className=" font-bold mb-3 mt-3">Dados Sintéticos</h1>
              <p>&nbsp;&nbsp;Para aumentar a base e testar os modelos em cenários de maior escala, foi utilizada uma Rede Adversária Generativa (GAN) por meio da biblioteca YData Synthetic, uma vez que os dados de crédito reais são escassos e sensíveis devido a restrições legais e confidencialidade. Essa metodologia preserva os padrões estatísticos do dataset original, mas com maior volume de dados e possibilitou avaliar a escalabilidade dos modelos e seu desempenho em bases maiores e desbalanceadas.</p>
              
              <h1 className=" font-bold mb-3 mt-3">Tratamento de Dados</h1>
              <p>&nbsp;&nbsp;O pré-processamento dos dados foi essencial para viabilizar a aplicação dos algoritmos de machine learning. As principais transformações realizadas incluíram a conversão de variáveis categóricas em representações binárias através do one-hot encoding, a codificação numérica ordenada das variáveis ordinais para preservar sua hierarquia natural, e a normalização das variáveis numéricas para equalizar suas escalas de influência.</p>
            </div>

            <div className="flex flex-col gap-4 h-full flex flex-col gap-4 h-full md:col-span-2">
              <div className="bg-muted/30 rounded-xl p-4 flex flex-col items-start flex-1">
                
                <div className="w-full overflow-hidden border-[0.5px] border-input">
                    <table className="table-auto w-full text-sm text-muted-foreground border-collapse">
                      <thead>
                        <tr>
                          <th className="text-left px-2 py-1 border-[0.3px] border-input text-black">Atributo</th>
                          <th className="text-left px-2 py-1 border-[0.3px] border-input text-black">Descrição</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-750">
                        {[
                          ['duration', 'Duração do crédito em meses'],
                          ['credit_amount', 'Valor do crédito solicitado'],
                          ['installment_rate', 'Taxa da prestação'],
                          ['present_residence', 'Tempo na residência atual'],
                          ['age', 'Idade do cliente'],
                          ['number_credits', 'Número de créditos existentes'],
                          ['people_liable', 'Número de dependentes'],
                          ['checking_status', 'Status da conta corrente'],
                          ['savings_status', 'Status da conta poupança'],
                          ['employment', 'Tempo de emprego'],
                          ['personal_status', 'Estado civil / sexo'],
                          ['other_debtors', 'Outros devedores / garantias'],
                          ['property', 'Tipo de propriedade'],
                          ['other_installment_plans', 'Outros planos de prestação'],
                          ['housing', 'Tipo de moradia'],
                          ['job', 'Categoria de emprego'],
                          ['telephone', 'Possui telefone?'],
                          ['foreign_worker', 'Trabalhador estrangeiro?'],
                          ['purpose', 'Finalidade do crédito'],
                          ['real_income', 'Renda real (ou transformada)'],
                          ['credit_history', 'Histórico de crédito / pontuação']
                        ].map(([attr, desc], idx, arr) => {
                          const last = idx === arr.length - 1;
                          return (
                            <tr key={attr + idx} className={idx % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'}>
                              <td className={"px-2 py-1 align-top font-medium border-[0.3px] border-input"}>{attr}</td>
                              <td className={"px-2 py-1 align-top border-[0.5px] border-input"}>{desc}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                </div>
              </div>


            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
