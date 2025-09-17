"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, TrendingUp, TrendingDown } from "lucide-react";

interface PredictionResultsProps {
  results?: {
    [key: string]: string | undefined;
    error?: string;
  } | null;
}

export function PredictionResults({ results }: PredictionResultsProps) {
  if (!results) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Preencha o formulário e clique em &quot;Fazer Predição&quot;</p>
          <p className="text-sm">Os resultados aparecerão aqui</p>
        </div>
      </div>
    );
  }

  if (results.error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Erro na Predição</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{results.error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const modelNames = {
    'random-forest': 'Random Forest',
    'xg-boost': 'XGBoost',
    'logistic-regression': 'Regressão Logística',
    'mlp': 'MLP (Rede Neural)'
  };

  const getPredictionColor = (prediction: string) => {
    return prediction === 'Bom Pagador' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getPredictionIcon = (prediction: string) => {
    return prediction === 'Bom Pagador' ? CheckCircle : AlertCircle;
  };

  const getPredictionTrend = (prediction: string) => {
    return prediction === 'Bom Pagador' ? TrendingUp : TrendingDown;
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Resultados das Predições</h3>
        <p className="text-sm text-muted-foreground">
          Comparação entre diferentes modelos de machine learning
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(results).map(([modelKey, prediction]) => {
          if (modelKey === 'error' || !prediction) return null;
          
          const modelName = modelNames[modelKey as keyof typeof modelNames] || modelKey;
          const Icon = getPredictionIcon(prediction);
          const TrendIcon = getPredictionTrend(prediction);
          
          return (
            <Card key={modelKey} className="transition-all hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{modelName}</CardTitle>
                  <Badge className={getPredictionColor(prediction)}>
                    <Icon className="h-3 w-3 mr-1" />
                    {prediction}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center space-x-2">
                  <TrendIcon className={`h-4 w-4 ${
                    prediction === 'Bom Pagador' ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    prediction === 'Bom Pagador' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {prediction === 'Bom Pagador' 
                      ? 'Cliente com baixo risco de inadimplência' 
                      : 'Cliente com alto risco de inadimplência'
                    }
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Resumo das Predições</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(() => {
              const predictions = Object.values(results).filter(p => p !== 'error');
              const goodPredictions = predictions.filter(p => p === 'Bom Pagador').length;
              const totalPredictions = predictions.length;
              const consensus = goodPredictions > totalPredictions / 2 ? 'Bom Pagador' : 'Mau Pagador';
              
              return (
                <>
                  <div className="flex justify-between text-sm">
                    <span>Bom Pagador:</span>
                    <span className="font-medium text-green-600">{goodPredictions}/{totalPredictions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Mau Pagador:</span>
                    <span className="font-medium text-red-600">{totalPredictions - goodPredictions}/{totalPredictions}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Consenso:</span>
                      <Badge className={getPredictionColor(consensus)}>
                        {consensus}
                      </Badge>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
