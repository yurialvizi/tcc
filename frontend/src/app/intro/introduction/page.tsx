import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

export default function Page() {
  return (
      <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </header>
        <div>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-[calc(100vh-4rem)]">
            <div className="bg-muted/30 rounded-xl p-6 flex flex-col justify-start md:col-span-2">
              <h1 className="text-2xl font-bold mb-3">Contextualização e Relevância</h1>
              <p className="mb-2 indent-paragraph">
                &nbsp;&nbsp;A concessão de crédito representa uma das principais fontes de receita para o setor bancário brasileiro, sendo operacionalizada principalmente através de empréstimos, financiamentos e cartões de crédito. No entanto, este segmento apresenta os maiores índices de inadimplência do sistema financeiro nacional, elevando significativamente o risco de crédito, que constitui o principal componente dos ativos ponderados pelo risco no país.
              </p>

              <p className="mb-2">
                &nbsp;&nbsp;Neste contexto desafiador, a capacidade de tomar decisões de crédito mais precisas e fundamentadas torna-se um fator crítico para a redução de perdas financeiras e o fortalecimento da estabilidade e competitividade das instituições bancárias. A aplicação de técnicas avançadas de machine learning e redes neurais emerge como uma abordagem promissora para aprimorar os processos de análise de risco e concessão de crédito.
              </p>

              <h2 className="text-2xl font-bold mb-3 mt-3">Objetivo e Escopo</h2>
              <p className="mb-2">
                &nbsp;&nbsp;O presente trabalho tem como objetivo principal realizar uma análise comparativa abrangente entre os principais algoritmos de machine learning e redes neurais aplicados ao processo de concessão de crédito para pessoas físicas. Esta investigação visa identificar os modelos mais eficazes na previsão de risco de crédito, considerando não apenas aspectos de desempenho técnico, mas também critérios operacionais relevantes para a aplicação prática no setor bancário.
              </p>

              <p className="mb-2">
                &nbsp;&nbsp;Para alcançar este objetivo, o projeto contempla as seguintes etapas metodológicas:
              </p>
              <ul className="list-disc list-inside mb-2 ml-4 mt-2">
                <li><strong>Preparação e Análise dos Dados:</strong> Utilização de um conjunto de dados específico para análise de crédito, que será submetido a rigorosas etapas de tratamento e análise exploratória, assegurando a consistência, qualidade e adequação das informações para o treinamento dos modelos.</li>
                <li><strong>Desenvolvimento e Treinamento dos Modelos:</strong> Implementação e treinamento individual dos algoritmos selecionados, com foco na geração de métricas de desempenho robustas que reflitam adequadamente sua capacidade de classificação em tarefas de análise de risco de crédito.</li>
                <li><strong>Análise Comparativa Estruturada:</strong> Aplicação do método ATAM (Architecture Tradeoff Analysis Method) para realizar uma avaliação comparativa técnica e qualitativa dos algoritmos, considerando múltiplas dimensões de análise beyond do desempenho puro, incluindo aspectos de implementação, manutenibilidade, escalabilidade e adequação ao contexto bancário.</li>
              </ul>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
