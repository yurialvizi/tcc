// app/page.tsx ou similar
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

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
          <div className="bg-neutral-50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-6 items-start">
            <h1 className="text-4xl font-bold mb-1">Matriz de Confusão</h1>
            <div className="flex flex-col md:flex-row gap-6 w-full">
              <div className="overflow-x-auto p-2">
                <table className="table-auto border-collapse border border-neutral-400 text-center text-sm">
                  <thead>
                    <tr>
                      <th className="px-2 py-2"></th>
                      <th className="px-2 py-2"></th>
                      <th
                        colSpan={2}
                        className="border border-neutral-400 px-4 py-1 font-bold"
                      >
                        VALOR PREDITO
                      </th>
                    </tr>
                    <tr>
                      <th className="px-4 py-2"></th>
                      <th className="px-4 py-2"></th>
                      <th className="border border-neutral-400 px-4 py-1 font-semibold">
                        Sim
                      </th>
                      <th className="border border-neutral-400 px-4 py-1 font-semibold">
                        Não
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th
                        rowSpan={2}
                        className="border border-neutral-400 px-2 py-1 font-bold text-black align-middle"
                        style={{
                          writingMode: "vertical-rl",
                          transform: "rotate(180deg)",
                        }}
                      >
                        REAL
                      </th>
                      <td className="border border-neutral-400 px-4 py-1 font-semibold">
                        Sim
                      </td>
                      <td className="border border-neutral-400 px-4 py-1 bg-neutral-200">
                        Verdadeiro Positivo
                        <br />
                        (TP)
                      </td>
                      <td className="border border-neutral-400 px-4 py-1 bg-neutral-300">
                        Falso Negativo
                        <br />
                        (FN)
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-neutral-400 px-4 py-1 font-semibold">
                        Não
                      </td>
                      <td className="border border-neutral-400 px-4 py-1 bg-neutral-300">
                        Falso Positivo
                        <br />
                        (FP)
                      </td>
                      <td className="border border-neutral-400 px-4 py-1 bg-neutral-200">
                        Verdadeiro Negativo
                        <br />
                        (TN)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-2 w-full md:w-[600px]">
                <h2 className="text-lg  mb-2">Onde:</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>TP (Verdadeiro Positivo): o cliente é um bom pagador e foi classificado corretamente como bom pagador;</li>
                  <li>FP (Falso Positivo): o cliente é um mau pagador, mas foi classificado incorretamente como bom pagador;</li>
                  <li>FN (Falso Negativo): o cliente é um bom pagador, mas foi classificado incorretamente como mau pagador;</li>
                  <li>TN (Verdadeiro Negativo): o cliente é um mau pagador e foi classificado corretamente como mau pagador;</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            <div className="bg-neutral-50 rounded-xl p-6 flex flex-col items-start">
              <h2 className="text-2xl font-bold mb-3">Métricas de Classificação</h2>
              <p className="mb-3">Abaixo estão as métricas mais utilizadas para avaliar classificadores binários no contexto de risco de crédito.</p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Precision (Precisão):</strong> proporção de verdadeiros positivos entre todas as previsões positivas. Indica o quão confiáveis são as predições positivas do modelo.
                </li>
                <li>
                  <strong>Recall (Revocação / Sensibilidade):</strong> proporção de verdadeiros positivos entre todos os positivos reais. Mede a capacidade do modelo de identificar casos positivos.
                </li>
                <li>
                  <strong>F1-score:</strong> média harmônica entre precision e recall. Útil quando há desequilíbrio entre classes.
                </li>
                <li>
                  <strong>Support:</strong> número de amostras reais de cada classe no conjunto avaliado. Importante para interpretar a confiança das métricas.
                </li>
                <li>
                  <strong>Accuracy (Acurácia):</strong> proporção de predições corretas sobre o total. Pode ser enganosa em datasets desbalanceados.
                </li>
                <li>
                  <strong>Macro Average:</strong> média aritmética das métricas calculadas por classe (tratando classes igualmente), útil para avaliar desempenho independente do balanceamento.
                </li>
                <li>
                  <strong>Weighted Average:</strong> média das métricas onde cada classe contribui proporcionalmente ao seu suporte (tamanho). Reflete melhor o desempenho global quando classes têm tamanhos diferentes.
                </li>
              </ul>
            </div>

            <div className="bg-neutral-50 rounded-xl p-6 flex flex-col items-start">
              <h2 className="text-2xl font-bold mb-3">Interpretando a Matriz de Confusão</h2>
              <p className="mb-2">A matriz de confusão resume os acertos e erros do classificador. A interpretação prática no contexto de concessão de crédito:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Verdadeiros Positivos (TP):</strong> clientes corretamente aprovados — objetivo desejado quando administrável.</li>
                <li><strong>Falsos Positivos (FP):</strong> clientes aprovados que deveriam ser negados — representam risco de perda financeira (inadimplência).</li>
                <li><strong>Falsos Negativos (FN):</strong> clientes negados que teriam pago — representam custo de oportunidade.</li>
                <li><strong>Verdadeiros Negativos (TN):</strong> clientes corretamente negados — reduz exposição ao risco.</li>
              </ul>
              <p className="mt-3">Exemplo de trade-off: reduzir FP reduz perdas por inadimplência, mas pode aumentar FN (recusar clientes bons). A escolha do limiar e do modelo depende do custo relativo desses erros.</p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
