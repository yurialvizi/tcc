"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { PredictorForm } from "@/components/PredictorForm";
import { PredictionResults } from "@/components/PredictionResults";
import { SHAPWaterfall } from "@/components/SHAPWaterfall";

export default function SimulatorPage() {
  const [results, setResults] = useState<Record<string, string> | { error: string } | null>(null);
  const [inputData, setInputData] = useState<Record<string, any> | null>(null);

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
            <h1 className="text-lg font-semibold">Simulador de Crédito</h1>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-8 p-4 pt-0 overflow-y-auto">

          <div className="space-y-4">
            <div className="rounded-lg bg-muted/50 ">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#4538FF] text-primary-foreground flex items-center justify-center text-sm font-semibold">1</div>
                  <h2 className="text-xl font-semibold">Dados do Cliente</h2>
                </div>
                <PredictorForm 
                  onResultsChange={setResults} 
                  onInputDataChange={setInputData}
                />
              </div>
            </div>
          </div>
          

          {results && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#4538FF] text-primary-foreground flex items-center justify-center text-sm font-semibold">2</div>
                    <h2 className="text-xl font-semibold">Resultados da Predição</h2>
                  </div>
                  <PredictionResults results={results} />
                </div>
              </div>
            </div>
          )}
          

          {results && !results.error && inputData && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 ">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#4538FF] text-primary-foreground flex items-center justify-center text-sm font-semibold">3</div>
                    <h2 className="text-xl font-semibold">Explicações SHAP</h2>
                  </div>
                  <SHAPWaterfall 
                    inputData={inputData} 
                    predictions={results as Record<string, string>} 
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}