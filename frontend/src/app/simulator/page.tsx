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

export default function SimulatorPage() {
  const [results, setResults] = useState<Record<string, string> | { error: string } | null>(null);

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
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="space-y-4">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Dados do Cliente</h2>
                  <PredictorForm onResultsChange={setResults} />
                </div>
              </div>
            </div>
            
            {/* Results Section */}
            <div className="space-y-4">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Resultados da Predição</h2>
                  <PredictionResults results={results} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}