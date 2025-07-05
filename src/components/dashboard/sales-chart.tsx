import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const chartData = [
  { month: "Jan", revenue: 4000, orders: 240 },
  { month: "Feb", revenue: 3000, orders: 180 },
  { month: "Mar", revenue: 5000, orders: 300 },
  { month: "Apr", revenue: 4500, orders: 270 },
  { month: "May", revenue: 6000, orders: 350 },
  { month: "Jun", revenue: 5500, orders: 320 },
  { month: "Jul", revenue: 7000, orders: 400 },
  { month: "Aug", revenue: 6500, orders: 380 },
  { month: "Sep", revenue: 8000, orders: 450 },
  { month: "Oct", revenue: 7500, orders: 420 },
  { month: "Nov", revenue: 9000, orders: 500 },
  { month: "Dec", revenue: 8500, orders: 480 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  orders: {
    label: "Orders",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface SalesChartProps {
  className?: string
}

export function SalesChart({ className }: SalesChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>Monthly revenue and orders for the current year</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="revenue"
              type="natural"
              fill="var(--color-revenue)"
              fillOpacity={0.4}
              stroke="var(--color-revenue)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}