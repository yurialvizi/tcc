"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Library,
  Cpu,
  FolderGit2,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"

import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Introdução",
      url: "#",
      icon: Library,
      isActive: true,
      items: [
        {
          title: "Sobre o projeto",
          url: "/intro/introducao",
        },
        {
          title: "Métricas",
          url: "/intro/metricas",
        },
      ],
    },
    {
      title: "Dataset",
      url: "#",
      icon: Library,
      isActive: true,
      items: [
        {
          title: "Sobre o dataset",
          url: "/datasample/analisys",
        },
        {
          title: "Análise Exploratória",
          url: "/datasample/analisys",
        },
      ],
    },
    {
      title: "Modelos",
      url: "#",
      icon: Bot,
      isActive: true,
      items: [
        {
          title: "Regressão Logística",
          url: "/models/Regression",
        },
        {
          title: "Random Forest",
          url: "/models/RandomForest",
        },
        {
          title: "XGBoost",
          url: "/models/XGBoost",
        },
        {
          title: "MLP",
          url: "/models/MLP",
        },
        {
          title: "Benchmark",
          url: "/models/MLP",
        },
      ],
    },
        {
          title: "Simulador",
          url: "#",
          icon: Cpu,
          isActive: true,
          items: [
            {
              title: "Simulador",
              url: "/simulator",
            },
          ],
        },
  ],
  projects: [
    {
      name: "GitHub",
      url: "#",
      icon: FolderGit2,
    },
    {
      name: "Monografia",
      url: "#",
      icon: BookOpen,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  )
}
