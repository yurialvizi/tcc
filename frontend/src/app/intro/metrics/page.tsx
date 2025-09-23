"use client";
// app/page.tsx ou similar
import { useEffect, useRef } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

function MathBlock({ tex }: { tex: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadAndRender() {
      if (!ref.current) return;
      // Load KaTeX CSS + JS from CDN if not present
      if (!document.getElementById('katex-css')) {
        const link = document.createElement('link');
        link.id = 'katex-css';
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
        document.head.appendChild(link);
      }
      if (!(window as any).katex) {
        try {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load KaTeX'));
            document.head.appendChild(script);
          });
        } catch (e) {
          console.warn('Could not load KaTeX:', e);
          if (ref.current) ref.current.textContent = tex;
          return;
        }
      }

      try {
        const katex = (window as any).katex;
        if (mounted && ref.current) {
          ref.current.innerHTML = '';
          katex.render(tex, ref.current, { displayMode: true, throwOnError: false });
        }
      } catch (e) {
        console.warn('KaTeX render error', e);
        if (ref.current) ref.current.textContent = tex;
      }
    }

    loadAndRender();
    return () => { mounted = false; };
  }, [tex]);

  return <div ref={ref} className="mb-3 text-sm" />;
}

export default function Page() {
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
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
         

          <div className="">
            <div className="bg-neutral-50 rounded-xl p-6 flex flex-col items-start">
              <h2 className="text-2xl font-bold mb-3">Métricas de Classificação</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div>
                  <h3 className="text-lg font-semibold mt-2">Acurácia</h3>
                  <p className="mb-3">A acurácia constitui uma métrica global de desempenho preditivo, representando a proporção de classificações corretas realizadas pelo algoritmo em relação ao total de casos avaliados:</p>
                    <MathBlock tex={"\\mathrm{Acurácia} = \\frac{TP + TN}{N}"} />

                  <h3 className="text-lg font-semibold mt-2">Recall (Sensibilidade)</h3>
                  <p className="mb-3">O recall, também denominado sensibilidade, quantifica a capacidade do modelo de identificar corretamente os casos positivos (bons pagadores) em relação ao total de casos positivos reais:</p>
                    <MathBlock tex={"\\mathrm{Recall} = \\frac{TP}{TP + FN}"} />

                  <h3 className="text-lg font-semibold mt-2">F1-Score</h3>
                  <p className="mb-3">O F1-score representa uma medida entre precisão e recall, oferecendo uma métrica sintética que equilibra ambos os aspectos:</p>
                    <MathBlock tex={"\\mathrm{F1\\text{-}Score} = 2 \\times \\frac{\\mathrm{Precisão} \\times \\mathrm{Recall}}{\\mathrm{Precisão} + \\mathrm{Recall}}"} />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mt-2">Especificidade</h3>
                  <p className="mb-3">A especificidade representa a proporção de casos negativos (maus pagadores) classificados corretamente pelo algoritmo em relação ao número total de casos negativos genuínos:</p>
                    <MathBlock tex={"\\mathrm{Especificidade} = \\frac{TN}{TN + FP}"} />

                  <h3 className="text-lg font-semibold mt-2">Precisão</h3>
                  <p className="mb-3">A precisão indica a fração de casos classificados como positivos (bons pagadores) que são efetivamente positivos, ou seja, a confiabilidade das classificações positivas do modelo:</p>
                    <MathBlock tex={"\\mathrm{Precisão} = \\frac{TP}{TP + FP}"} />

                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
