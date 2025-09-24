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
              <h1 className="text-2xl font-bold mb-3">
                ATAM — Análise de Trade-offs Arquiteturais
              </h1>
              <p className="mb-2 indent-paragraph">
                &nbsp;&nbsp;O ATAM (Architecture Tradeoff Analysis Method) é uma
                técnica prática para avaliar alternativas arquiteturais a partir
                de cenários de negócio e atributos de qualidade, como
                desempenho, segurança, disponibilidade e manutenibilidade. A
                seguir apresentamos, passo a passo, como aplicamos o ATAM ao
                problema de concessão de crédito e o que cada etapa revelou
                sobre os modelos avaliados.
              </p>

              <h2 className="text-lg font-bold mb-3 mt-3">
                Passo 1 — Coleta de cenários (o que o sistema deve suportar)
              </h2>
              <p className="mb-2">
                <b>O que é:</b> identificar situações operacionais críticas que
                exercem os requisitos de qualidade.
              </p>
              <p className="mb-2">
                <b>O que fizemos:</b> definimos cenários relevantes para decisão
                de crédito no varejo (pessoas físicas). Exemplos: processar alto
                volume diário; evitar concessão a inadimplentes; não recusar
                bons pagadores.
              </p>
              <p className="mb-2">
                <b>Insight:</b> os cenários priorizam tanto segurança financeira
                (minimizar falsos positivos) quanto experiência do usuário
                (baixa latência).
              </p>
              <Separator className="my-2" />
              <h2 className="text-lg font-bold mb-3 mt-3">
                Passo 2 — Coleta de requisitos, restrições e ambiente
              </h2>
              <p className="mb-2">
                <b>O que é:</b> eliciar requisitos não-funcionais e limitações
                de execução.
              </p>
              <p className="mb-2">
                <b>O que fizemos:</b> fixamos metas e condições de teste, como
                tempo de processamento ideal menor que 100 segundos, acurácia
                mínima de 80%, execução em CPU única com memória limitada.
              </p>
              <p className="mb-2">
                <b>Insight:</b> essas restrições moldam a viabilidade
                operacional dos modelos, pois soluções muito lentas ou que
                exigem GPU podem ser descartadas ou precisam de otimização.
              </p>
              <Separator className="my-2" />
              <h2 className="text-lg font-bold mb-3 mt-3">
                Passo 3 — Descrição das arquiteturas (modelos)
              </h2>
              <p className="mb-2">
                <b>O que é:</b> documentar cada alternativa arquitetural ou
                algorítmica.
              </p>
              <p className="mb-2">
                <b>O que fizemos:</b> descrevemos Regressão Logística, Random
                Forest, XGBoost e MLP em termos de estrutura, complexidade e
                custo de inferência.
              </p>
              <p className="mb-2">
                <b>Insight:</b> modelos simples como a regressão são rápidos e
                interpretáveis, ensembles como Random Forest e XGBoost
                equilibram acurácia e custo, enquanto a MLP modela relações
                complexas a custo de latência.
              </p>
              <Separator className="my-2" />
              <h2 className="text-lg font-bold mb-3 mt-3">
                Passo 4 — Análise isolada dos atributos (métricas por modelo)
              </h2>
              <p className="mb-2">
                <b>O que é:</b> medir desempenho e latência sob mesmas
                condições.
              </p>
              <p className="mb-2">
                <b>O que fizemos:</b> testamos cada modelo e coletamos métricas
                como acurácia, recall, especificidade, precisão, F1 e tempos de
                inferência.
              </p>
              <p className="mb-2">
                <b>Insight:</b> Random Forest e XGBoost apresentam alto
                desempenho; a MLP tem boa precisão, mas latência muito elevada;
                a Regressão Logística é rápida, porém com baixa especificidade.
              </p>
              <Separator className="my-2" />
              <h2 className="text-lg font-bold mb-3 mt-3">
                Passo 5 — Identificação de sensibilidades
              </h2>
              <p className="mb-2">
                <b>O que é:</b> estudar como variações de volume de dados ou
                parâmetros afetam cada alternativa.
              </p>
              <p className="mb-2">
                <b>O que fizemos:</b> medimos tempo de inferência em função do
                volume e testamos sensibilidade a hiperparâmetros como número de
                árvores e camadas.
              </p>
              <p className="mb-2">
                <b>Insight:</b> a MLP escala mal em termos de latência; Random
                Forest e XGBoost são sensíveis ao número de árvores (trade-off
                entre precisão e tempo); a Regressão é sensível à separabilidade
                das classes, o que impacta sua especificidade.
              </p>
              <Separator className="my-2" />
              <h2 className="text-lg font-bold mb-3 mt-3">
                Passo 6 — Identificação de trade-offs
              </h2>
              <p className="mb-2">
                <b>O que é:</b> explicitar compromissos entre atributos, como
                latência versus acurácia.
              </p>
              <p className="mb-2">
                <b>O que fizemos:</b> cruzamos métricas e tempos de execução
                para cada modelo, destacando conflitos.
              </p>
              <p className="mb-2">
                <b>Insight:</b> não há modelo dominante. O XGBoost entrega
                excelente recall com tempo moderado, um bom compromisso; a MLP
                tem precisão alta em alguns cenários, mas latência inviável; a
                Regressão Logística é eficiente em tempo, mas falha em qualidade
                de classificação.
              </p>
              <Separator className="my-2" />
              <h2 className="text-lg font-bold mb-3 mt-3">
                Passo 7 — Priorização de cenários
              </h2>
              <p className="mb-2">
                <b>O que é:</b> stakeholders definem pesos para cenários e
                atributos, determinando o que é mais crítico.
              </p>
              <p className="mb-2">
                <b>O que fizemos:</b> priorizamos minimizar falsos positivos
                (segurança) como critério principal e latência menor que 60
                segundos como critério operacional secundário.
              </p>
              <p className="mb-2">
                <b>Insight:</b> esses critérios favorecem soluções com alto
                recall e latência controlada, o que reduz o conjunto de escolhas
                aceitáveis.
              </p>
              <Separator className="my-2" />
              <h2 className="text-lg font-bold mb-3 mt-3">
                Passo 8 — Reanálise com cenários priorizados
              </h2>
              <p className="mb-2">
                <b>O que é:</b> reavaliar métricas considerando os pesos e
                prioridades definidos.
              </p>
              <p className="mb-2">
                <b>O que fizemos:</b> aplicamos as prioridades de foco em recall
                e latência e comparámos os modelos sob essa ótica.
              </p>
              <p className="mb-2">
                <b>Insight:</b> o XGBoost mantém recall acima de 0.94 e tempo
                próximo de 37 segundos, dentro do limite; Random Forest tem
                recall semelhante, mas tempo perto do limite; Regressão
                Logística e MLP falham em pelo menos um dos critérios. Assim, o
                XGBoost mostra o melhor compromisso.
              </p>
              <Separator className="my-2" />
              <h2 className="text-lg font-bold mb-3 mt-3">
                Passo 9 — Apresentação dos resultados e recomendação
              </h2>
              <p className="mb-2">
                <b>O que é:</b> consolidar achados, riscos e recomendações
                operacionais.
              </p>
              <p className="mb-2">
                <b>O que fizemos:</b> geramos relatório com sensibilidades,
                trade-offs e recomendação final.
              </p>
              <p className="mb-2">
                <b>Insight:</b> a recomendação é adotar XGBoost como
                modelo-padrão para suporte diário à decisão de crédito,
                complementado por medidas como paralelização da inferência para
                reduzir latência, monitoramento de deriva de dados e manutenção
                de modelos secundários para cenários específicos ou
                explicabilidade simplificada.
              </p>
              <Separator className="my-2" />
              <h2 className="text-lg font-bold mb-3 mt-3">
                Conclusão — o que isso significa para a plataforma
              </h2>
              <p className="mb-2">
                O ATAM permitiu transformar métricas técnicas em decisões de
                negócio claras, conectando prioridades como segurança e
                latência. A escolha recomendada, o XGBoost, entrega alto
                desempenho e latência aceitável sob as restrições definidas.
                Além disso, é fundamental integrar monitoramento e
                re-treinamento automático no pipeline para mitigar riscos, como
                deriva e mudanças no perfil dos clientes.
              </p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
