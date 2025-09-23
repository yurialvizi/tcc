"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle } from "lucide-react";

interface SHAPSummaryProps {
  modelName?: string;
}

export default function SHAPSummary({ modelName = 'random-forest' }: SHAPSummaryProps) {
  const [summaryB64, setSummaryB64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://127.0.0.1:5001/shap/plots/${modelName}`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        if (mounted) {
          setSummaryB64(data?.summary_plot ?? null);
        }
      } catch (err: any) {
        console.error('Failed to fetch SHAP summary:', err);
        if (mounted) setError(err?.message ?? String(err));
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [modelName]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">SHAP Summary Plot</CardTitle>
          <Badge variant="outline">Interpretabilidade</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="animate-spin mr-2" />
            <span>Carregando gráfico SHAP...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Erro ao carregar gráfico SHAP: {error}</p>
          </div>
        ) : summaryB64 ? (
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-white min-h-[360px] flex items-center justify-center overflow-hidden">
              <img
                src={`data:image/png;base64,${summaryB64}`}
                alt={`SHAP summary plot for ${modelName}`}
                className="max-w-full h-auto object-contain"
              />
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>O que é este gráfico?</strong></p>
              <p>
                O gráfico 'summary_plot' do SHAP mostra a distribuição das importâncias das features para todas as amostras.
                Cada ponto representa uma amostra e a cor indica o valor da feature (baixo → azul, alto → vermelho).
              </p>
              <p><strong>Como interpretar:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>O eixo vertical lista as features ordenadas por importância média.</li>
                <li>O deslocamento horizontal mostra o efeito da feature na predição (positivo/negativo).</li>
                <li>Cores vermelhas indicam altos valores da feature; azuis indicam baixos valores.</li>
                <li>Pontos espalhados indicam variabilidade no efeito entre amostras.</li>
              </ul>
              <p className="mt-2">Essas informações ajudam a entender quais variáveis têm maior impacto nas decisões do modelo e como seu valor altera a predição.</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum gráfico SHAP disponível para este modelo.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
