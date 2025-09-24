"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchShapWaterfallAll, ShapWaterfallAllResponse } from "@/app/api/api";
import { Loader2, BarChart3, AlertCircle, Eye, EyeOff } from "lucide-react";

interface SHAPWaterfallProps {
  inputData: Record<string, string | number>;
  predictions: Record<string, string>;
}

const modelNames = {
  'logistic-regression': 'Regressão Logística',
  'random-forest': 'Random Forest',
  'xg-boost': 'XGBoost',
  'mlp': 'MLP (Rede Neural)'
};

export function SHAPWaterfall({ inputData, predictions }: SHAPWaterfallProps) {
  const [waterfallData, setWaterfallData] = useState<ShapWaterfallAllResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedModels, setExpandedModels] = useState<Set<string>>(new Set());

  const handleGenerateWaterfalls = async () => {
    if (!inputData) return;

    setIsLoading(true);
    setError(null);
    setWaterfallData(null);

    try {
      const result = await fetchShapWaterfallAll(inputData);
      
      if (result.error) {
        setError(result.error);
      } else {
        setWaterfallData(result);
        // Expand all models by default
        setExpandedModels(new Set(Object.keys(result.waterfall_plots)));
      }
    } catch {
      setError('Erro ao gerar explicações SHAP');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleModelExpansion = (modelName: string) => {
    const newExpanded = new Set(expandedModels);
    if (newExpanded.has(modelName)) {
      newExpanded.delete(modelName);
    } else {
      newExpanded.add(modelName);
    }
    setExpandedModels(newExpanded);
  };

  const getPredictionColor = (prediction: string) => {
    return prediction === 'Bom Pagador' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getPredictionIcon = (prediction: string) => {
    return prediction === 'Bom Pagador' ? '✅' : '❌';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Explicações SHAP
          </CardTitle>
          <Badge variant="outline">Interpretabilidade</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Generate Button */}
        <div className="flex justify-center">
          <Button 
            onClick={handleGenerateWaterfalls}
            disabled={isLoading}
            className="px-8 py-2 bg-[#4538FF] hover:bg-[#372ccc] text-white"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Gerando Explicações...
              </>
            ) : (
              <>
                <BarChart3 className="h-5 w-5 mr-2 bg-[#4538FF]" />
                Gerar Explicações
              </>
            )}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center space-x-2 text-destructive bg-destructive/10 p-3 rounded-md">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Waterfall Plots */}
        {waterfallData?.waterfall_plots && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h4 className="font-medium text-lg">Explicações SHAP - Todos os Modelos</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Clique nos modelos para expandir/recolher as explicações
              </p>
            </div>

            <div className="grid gap-4">
              {['logistic-regression', 'random-forest', 'xg-boost', 'mlp']
                .filter(modelKey => waterfallData.waterfall_plots[modelKey])
                .map((modelKey) => {
                  const waterfallPlot = waterfallData.waterfall_plots[modelKey];
                const modelName = modelNames[modelKey as keyof typeof modelNames] || modelKey;
                const prediction = predictions[modelKey];
                const isExpanded = expandedModels.has(modelKey);
                
                return (
                  <Card key={modelKey} className="overflow-hidden">
                    <CardHeader 
                      className="cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => toggleModelExpansion(modelKey)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {isExpanded ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="font-medium">{modelName}</span>
                          </div>
                          {prediction && (
                            <Badge className={getPredictionColor(prediction)}>
                              {getPredictionIcon(prediction)} {prediction}
                            </Badge>
                          )}
                        </div>
                        <Badge variant="outline">
                          {isExpanded ? 'Recolher' : 'Expandir'}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    {isExpanded && (
                      <CardContent className="pt-0">
                        {waterfallPlot ? (
                          <div className="space-y-3">
                            <div className="border rounded-lg p-4 bg-white min-h-[400px] flex items-center justify-center overflow-hidden">
                              <img 
                                src={`data:image/png;base64,${waterfallPlot}`}
                                alt={`SHAP Waterfall Plot for ${modelName}`}
                                className="max-w-full h-auto max-h-[350px] object-contain"
                                style={{ transform: 'scale(1.1)', transformOrigin: 'center' }}
                              />
                            </div>
                            
                            <div className="text-xs text-muted-foreground space-y-1">
                              <p><strong>Interpretação:</strong></p>
                              <ul className="list-disc list-inside space-y-1 ml-2">
                                <li>Barras vermelhas: fatores que diminuem o risco de inadimplência</li>
                                <li>Barras azuis: fatores que aumentam o risco de inadimplência</li>
                                <li>O tamanho da barra indica a magnitude do impacto</li>
                                <li>A linha mostra como cada fator contribui para a decisão final</li>
                              </ul>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>Erro ao gerar explicação para este modelo</p>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* Summary */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Resumo das Explicações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>• <strong>Comparação entre modelos:</strong> Observe como diferentes modelos interpretam os mesmos fatores</p>
                  <p>• <strong>Consistência:</strong> Fatores que aparecem com o mesmo impacto em múltiplos modelos são mais confiáveis</p>
                  <p>• <strong>Diferenças:</strong> Modelos podem dar pesos diferentes aos mesmos fatores</p>
                  <p>• <strong>Transparência:</strong> Cada explicação mostra exatamente como o modelo chegou à sua decisão</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!waterfallData && !error && !isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Clique em &quot;Gerar Explicações&quot; para ver como cada modelo interpreta os dados</p>
            <p className="text-sm">As explicações mostrarão quais fatores influenciaram cada predição</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}