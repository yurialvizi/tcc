"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { GradientBackground } from "@/components/GradientBackground";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="relative min-h-screen overflow-hidden">
          <GradientBackground />
          <header className="flex h-16 shrink-0 items-center gap-2 relative z-10">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
            </div>
          </header>
          <div className="relative z-10">
            <div className="mx-auto sm:py-48 lg:py-56">
              <div className="text-center">
                <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
                  Projeto de Formatura
                </h1>
                <p className="mt-4 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                  Beatriz Pama | Isabelle Vargas | Yuri Alvizi
                </p>
                <p className="mt-2 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                  Orientador: Prof. Dr. Reginaldo Arakaki
                </p>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
