import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts"

const customerData = [
  { name: "New Customers", value: 400, color: "#8884d8" },
  { name: "Returning Customers", value: 300, color: "#82ca9d" },
  { name: "VIP Customers", value: 200, color: "#ffc658" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  new: {
    label: "New",
    color: "hsl(var(--chart-1))",
  },
  returning: {
    label: "Returning",
    color: "hsl(var(--chart-2))",
  },
  vip: {
    label: "VIP",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

interface CustomerInsightsProps {
  className?: string
}

export function CustomerInsights({ className }: CustomerInsightsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Customer Insights</CardTitle>
        <CardDescription>Customer distribution and engagement metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={customerData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
            >
              {customerData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-6 space-y-2">
          {customerData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}