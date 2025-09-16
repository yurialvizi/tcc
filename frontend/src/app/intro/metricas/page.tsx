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
                  <li>TP: o cliente é um bom pagador e foi classificado como bom pagador;</li>
                  <li>FP: o cliente é um mau pagador e foi classificado como bom pagador;</li>
                  <li>FN: o cliente é um bom pagador e foi classificado como bom pagador;</li>
                  <li>TN: o cliente é um mau pagador e foi classificado como um mau pagador</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            <div className="bg-neutral-50 aspect-video rounded-xl p-6 flex flex-col items-start">
              <h1 className="text-4xl font-bold mb-2">Métricas</h1>
            </div>
            <div className="bg-neutral-50 aspect-video rounded-xl p-6 flex flex-col items-start">
              <h1 className="text-4xl font-bold mb-2">texto</h1>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
