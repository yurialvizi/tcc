"use client";

import * as React from "react";
import { BookOpen, Bot, Library, Cpu, FolderGit2, Github, Bookmark, Waypoints, TextSearch } from "lucide-react";

import { NavMain } from "@/components/nav-main";

import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

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
          url: "/intro/introduction",
        },
        {
          title: "Métricas",
          url: "/intro/metrics",
        },
      ],
    },
    {
      title: "Dataset",
      url: "#",
      icon: TextSearch,
      isActive: true,
      items: [
        {
          title: "Sobre o dataset",
          url: "/datasample/about",
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

      ],
    },
    {
      title: "ATAM",
      url: "#",
      icon: Waypoints,
      isActive: true,
      items: [
        {
          title: "ATAM",
          url: "/atam",
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
      url: "https://github.com/yurialvizi/tcc",
      icon: FolderGit2,
    },
    {
      name: "Monografia",
      url: "https://yurialvizi.github.io/tcc/monografia.pdf",
      icon: BookOpen,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent className="flex flex-col">
        <NavMain items={data.navMain} />

        <div className="mt-auto p-3 w-full flex justify-center">
          <div className="flex gap-2">
            {data.projects.map((project) => (
              <Button
                asChild
                key={project.name}
                variant="ghost"
                className="h-10 px-3 gap-1"
              >
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={project.name}
                >
                  <project.icon className="w-4 h-4" />
                  <span className="text-sm">{project.name}</span>
                </a>
              </Button>
            ))}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
