"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
          <div className="bg-neutral-50 rounded-xl p-6 flex flex-col items-start gap-12 w-full">
            {/* ============================= */}
            {/* PARTE 1 — ENTENDENDO O ATAM */}
            {/* ============================= */}
            <section className="w-full flex flex-col gap-4">
              <h1 className="text-3xl font-bold">
                Architecture Tradeoff Analysis Method (ATAM)
              </h1>
              <p className="text-base max-w-3xl">
                O ATAM é um método estruturado de avaliação de arquiteturas que
                permite identificar trade-offs, sensibilidades e riscos técnicos
                de forma sistemática, considerando múltiplos atributos de
                qualidade relevantes ao contexto de negócio. Ele é composto por
                9 passos, divididos em 4 etapas, que são explicados
                detalhadamente a seguir.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-6 w-full">
                {/* 4 cards do ATAM */}
                <Card>
                  <CardHeader>
                    <CardTitle>1. Apresentação</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm flex flex-col gap-2">
                    <ul className="list-disc ml-4">
                      <li>Passo 1: Exposição do método</li>
                      <li>Passo 2: Definição dos business drivers</li>
                      <li>Passo 3: Apresentação inicial da arquitetura</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>2. Investigação e Análise</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm flex flex-col gap-2">
                    <ul className="list-disc ml-4">
                      <li>
                        Passo 4: Identificação das abordagens arquiteturais
                      </li>
                      <li>Passo 5: Construção da árvore utilitária</li>
                      <li>Passo 6: Análise técnica das abordagens</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>3. Testes</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm flex flex-col gap-2">
                    <ul className="list-disc ml-4">
                      <li>
                        Passo 7: Brainstorm de cenários e priorização dos
                        cenários críticos
                      </li>
                      <li>Passo 8: Reanálise baseada nas prioridades</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>4. Resultados</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm flex flex-col gap-2">
                    <ul className="list-disc ml-4">
                      <li>
                        Passo 9: Síntese dos achados, documentação dos
                        trade-offs e recomendações finais
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* =================================== */}
            {/* PARTE 2 — APLICAÇÃO DO ATAM (9 passos) */}
            {/* =================================== */}
            <section className="w-full flex flex-col gap-10">
            <h2 className="text-2xl font-bold my-1 md:my-2">Aplicação do ATAM aos resultados obtidos</h2>

              <div className="flex flex-col gap-6 w-full">
                {/* PASSO 1 */}
                <Card>
                  <CardHeader>
                    <CardTitle>Passo 1 — Coleta de Cenários</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm flex flex-col gap-4">
                    <p>
                      Definição dos cenários críticos que o sistema deve
                      suportar.
                    </p>
                    <ul className="list-disc ml-4">
                      <li>Processar alto volume diário de solicitações</li>
                      <li>
                        Minimizar falsos positivos (evitar concessão a
                        inadimplentes)
                      </li>
                      <li>
                        Minimizar falsos negativos (não negar crédito a bons
                        pagadores)
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* PASSO 2 */}
                <Card>
                  <CardHeader>
                    <CardTitle>Passo 2 — Requisitos e Restrições</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm flex flex-col gap-4">
                    <ul className="list-disc ml-4">
                      <li>Acurácia mínima: 80% (RNF01)</li>
                      <li>Tempo de treinamento menor possível (RNF02)</li>
                      <li>Infraestrutura alvo: CPU única e memória limitada</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* PASSO 3 */}
                <Card>
                  <CardHeader>
                    <CardTitle>Passo 3 — Descrição das Arquiteturas</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
                    {[
                      {
                        name: "Regressão Logística",
                        points: [
                          "Modelo linear interpretável",
                          "Inferência muito rápida",
                          "Limitações em padrões não lineares",
                        ],
                      },
                      {
                        name: "Random Forest",
                        points: [
                          "40 árvores bootstrap",
                          "Robusto a ruído",
                          "Custo computacional moderado",
                        ],
                      },
                      {
                        name: "XGBoost",
                        points: [
                          "210 árvores, regularização L1/L2",
                          "Alto poder preditivo",
                          "Exige tuning cuidadoso",
                        ],
                      },
                      {
                        name: "MLP",
                        points: [
                          "3 camadas ocultas (128→64→32)",
                          "Alta capacidade expressiva",
                          'Tempo de treino elevado e "caixa opaca"',
                        ],
                      },
                    ].map((algo) => (
                      <Card
                        key={algo.name}
                        className="rounded-xl p-4 shadow-sm"
                      >
                        <CardHeader>
                          <CardTitle className="text-lg">{algo.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc ml-4">
                            {algo.points.map((p) => (
                              <li key={p}>{p}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>

                {/* PASSO 4 */}
                <Card>
                  <CardHeader>
                    <CardTitle>Passo 4 — Análise dos Atributos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Image
                      src="/atam/comparison-chart.png"
                      alt="Métricas dos algoritmos"
                      width={800}
                      height={400}
                      className="rounded-lg border mx-auto"
                    />

                    <div className="overflow-x-auto mt-6">
                      <table className="w-full text-sm text-left border rounded-lg overflow-hidden">
                        <thead className="bg-neutral-100 text-sm font-semibold">
                          <tr>
                            <th className="px-3 py-2 border">Algoritmo</th>
                            <th className="px-3 py-2 border">
                              Tempo de Treinamento
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-3 py-2 border">
                              Regressão Logística
                            </td>
                            <td className="px-3 py-2 border">~21 s</td>
                          </tr>
                          <tr>
                            <td className="px-3 py-2 border">Random Forest</td>
                            <td className="px-3 py-2 border">~74 s</td>
                          </tr>
                          <tr>
                            <td className="px-3 py-2 border">XGBoost</td>
                            <td className="px-3 py-2 border">~37 s</td>
                          </tr>
                          <tr>
                            <td className="px-3 py-2 border">MLP</td>
                            <td className="px-3 py-2 border">~784 s</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mt-6">
                      <div className="p-3 bg-muted/10 rounded">
                        <h4 className="font-semibold">Fato</h4>
                        <p className="text-sm">
                          XGBoost obteve o melhor desempenho em todas as
                          métricas
                        </p>
                      </div>
                      <div className="p-3 bg-muted/10 rounded">
                        <h4 className="font-semibold">Custo</h4>
                        <p className="text-sm">
                          MLP teve tempo de treinamento muito superior (≈784 s).
                        </p>
                      </div>
                      <div className="p-3 bg-muted/10 rounded">
                        <h4 className="font-semibold">Risco</h4>
                        <p className="text-sm">
                          Regressão Logística apresenta baixa sensibilidade em
                          recall (0.2779).
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* PASSO 5 */}
                <Card>
                  <CardHeader>
                    <CardTitle>Passo 5 — Sensibilidades</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="list-disc ml-4">
                      <li>
                        MLP: tempo de treinamento cresce muito com volume de
                        dados (escala mal).
                      </li>
                      <li>
                        Random Forest e XGBoost: sensíveis ao número de árvores
                        (trade-off precisão × tempo).
                      </li>
                      <li>
                        Regressão Logística: sensível à separabilidade das
                        classes (impacto no recall).
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* PASSO 6 */}
                <Card>
                  <CardHeader>
                    <CardTitle>Passo 6 — Trade-offs</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">
                        Desempenho vs Complexidade
                      </h4>
                      <p>
                        XGBoost e Random Forest entregam alto desempenho, com
                        custo de treinamento maior que modelos lineares.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">
                        Recall vs Interpretabilidade
                      </h4>
                      <p>
                        Modelos mais complexos (XGBoost, MLP) aumentam recall e
                        F1, mas reduzem interpretabilidade em relação à
                        Regressão Logística.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* PASSO 7 */}
                <Card>
                  <CardHeader>
                    <CardTitle>Passo 7 — Priorização de Cenários</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>
                      Na priorização hipotética conduzida com stakeholders, o
                      critério de minimizar falsos positivos (segurança
                      financeira) foi classificado como mais importante. Além
                      disso, destacou-se a relevância da interpretabilidade e
                      capacidade de auditoria dos modelos no contexto bancário.
                    </p>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 rounded bg-muted/10">
                        <h5 className="font-semibold">Critério principal</h5>
                        <p className="text-sm">
                          Minimizar falsos positivos (garantir segurança
                          financeira).
                        </p>
                      </div>
                      <div className="p-3 rounded bg-muted/10">
                        <h5 className="font-semibold">Critério secundário</h5>
                        <p className="text-sm">
                          Alta interpretabilidade e capacidade de auditoria dos
                          resultados.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* PASSO 8 */}
                <Card>
                  <CardHeader>
                    <CardTitle>Passo 8 — Reanálise</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>
                      Com as prioridades definidas, reavaliamos as métricas:
                      XGBoost possui acurácia, recall especificidade, precisão e
                      F1 superiores com tempo de treinamento inferior, em
                      comparação com o Random Forest, apesar de uma menor
                      interpretabilidade. Os outros modelos ficam aquém nas
                      prioridades definidas.
                    </p>
                    <div className="mt-3 p-3 rounded bg-muted/10">
                      <strong>Conclusão:</strong> XGBoost atende melhor os
                      requisitos priorizados; Random Forest é alternativa
                      viável, porém com tempo de treinamento maior.
                    </div>
                  </CardContent>
                </Card>

                {/* PASSO 9 */}
                <Card>
                  <CardHeader>
                    <CardTitle>Passo 9 — Resultados e Recomendação</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm flex flex-col gap-4">
                    <p>Relatório consolidado com recomendações operacionais.</p>

                    <div className="p-4 rounded-lg border">
                      <h4 className="font-semibold">Recomendação</h4>
                      <p className="text-sm">
                        A recomendação destaca as sensibilidades e trade-offs
                        identificados e indica a adoção de XGBoost como
                        arquitetura padrão para apoio diário à decisão de
                        crédito. Para mitigar riscos residuais, sugere-se o
                        ajuste fino de hiperparâmetros, assegurando equilíbrio
                        entre alta precisão preditiva e desempenho operacional.
                        Sendo assim, se fosse necessária a escolha de somente um
                        algoritmo, o XGBoost seria o mais adequado.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-3 rounded bg-muted/10">
                        <h5 className="font-semibold">Riscos</h5>
                        <ul className="list-disc ml-4 text-sm">
                          <li>
                            Sensibilidade a hiperparâmetros, podendo gerar
                            variação de desempenho.
                          </li>
                          <li>
                            Possibilidade de degradação por mudanças na
                            distribuição dos dados (drift).
                          </li>
                        </ul>
                      </div>

                      <div className="p-3 rounded bg-muted/10">
                        <h5 className="font-semibold">Mitigações</h5>
                        <ul className="list-disc ml-4 text-sm">
                          <li>
                            Ajuste fino e validação regular dos hiperparâmetros
                            para manter estabilidade.
                          </li>
                          <li>
                            Monitoramento contínuo e protocolos de
                            re-treinamento para reduzir efeitos de drift.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
