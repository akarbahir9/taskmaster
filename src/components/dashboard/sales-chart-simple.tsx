import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const salesData = [
  { month: "Jan", revenue: 4000, height: 40 },
  { month: "Feb", revenue: 3000, height: 30 },
  { month: "Mar", revenue: 5000, height: 50 },
  { month: "Apr", revenue: 4500, height: 45 },
  { month: "May", revenue: 6000, height: 60 },
  { month: "Jun", revenue: 5500, height: 55 },
  { month: "Jul", revenue: 7000, height: 70 },
  { month: "Aug", revenue: 6500, height: 65 },
  { month: "Sep", revenue: 8000, height: 80 },
  { month: "Oct", revenue: 7500, height: 75 },
  { month: "Nov", revenue: 9000, height: 90 },
  { month: "Dec", revenue: 8500, height: 85 },
]

interface SalesChartProps {
  className?: string
}

export function SalesChart({ className }: SalesChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>Monthly revenue for the current year</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between h-48 gap-2">
          {salesData.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2 flex-1">
              <div 
                className="w-full bg-blue-500 rounded-t-sm transition-all hover:bg-blue-600"
                style={{ height: `${item.height}%` }}
                title={`${item.month}: $${item.revenue.toLocaleString()}`}
              />
              <span className="text-xs text-muted-foreground">{item.month}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Total Revenue: $72,000 | Average: $6,000/month
        </div>
      </CardContent>
    </Card>
  )
}