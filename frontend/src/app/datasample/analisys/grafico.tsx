"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { fetchAnalysisData, getSex } from "../../api/api";

export const description = "A bar chart by sex";

const chartConfig = {
  count: {
    label: "Count",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function ChartBarDefault() {
  const [chartData, setChartData] = useState<{ sex: string; count: number }[]>(
    []
  );

  useEffect(() => {
    async function fetchSexData() {
      try {
        const analysis = await fetchAnalysisData();
        const sexData = getSex(analysis);

        setChartData([
          { sex: "Female", count: sexData.female || 0 },
          { sex: "Male", count: sexData.male || 0 },
        ]);
      } catch (error) {
        console.error("Failed to fetch sex data:", error);
      }
    }

    fetchSexData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sex Distribution</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData} width={600} height={400}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="sex"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="oklch(0.646 0.222 41.116)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
    </Card>
  );
}
