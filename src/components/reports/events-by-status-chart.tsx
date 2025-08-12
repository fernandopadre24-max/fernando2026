
'use client';

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Event } from '@/types';

interface EventsByStatusChartProps {
    events: Event[];
}

const chartConfig = {
  done: {
    label: "Realizados",
    color: "hsl(var(--chart-2))",
  },
  pending: {
    label: "Pendentes",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function EventsByStatusChart({ events }: EventsByStatusChartProps) {
    const doneCount = events.filter(e => e.isDone).length;
    const pendingCount = events.filter(e => !e.isDone).length;
    const totalEvents = events.length;

    const chartData = [
      { status: "pending", count: pendingCount, fill: "var(--color-pending)" },
      { status: "done", count: doneCount, fill: "var(--color-done)" },
    ]

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Eventos por Status</CardTitle>
                <CardDescription>Visão geral de eventos realizados e pendentes.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                 <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                    >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="status"
                            innerRadius={60}
                            strokeWidth={5}
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
             <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Total de {totalEvents} eventos registrados.
                </div>
                <div className="leading-none text-muted-foreground">
                    <span className="text-green-600">{doneCount} Realizados</span> | <span className="text-yellow-600">{pendingCount} Pendentes</span>
                </div>
            </CardFooter>
        </Card>
    );
}
