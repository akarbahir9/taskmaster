import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const customerData = [
  { 
    name: "New Customers", 
    value: 400, 
    percentage: 44.4, 
    color: "bg-blue-500",
    description: "First-time buyers"
  },
  { 
    name: "Returning Customers", 
    value: 300, 
    percentage: 33.3, 
    color: "bg-green-500",
    description: "Repeat customers"
  },
  { 
    name: "VIP Customers", 
    value: 200, 
    percentage: 22.2, 
    color: "bg-purple-500",
    description: "High-value customers"
  },
]

interface CustomerInsightsProps {
  className?: string
}

export function CustomerInsights({ className }: CustomerInsightsProps) {
  const totalCustomers = customerData.reduce((sum, item) => sum + item.value, 0)
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Customer Insights</CardTitle>
        <CardDescription>Customer distribution and engagement metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold">{totalCustomers.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Total Customers</div>
        </div>
        
        <div className="space-y-4">
          {customerData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{item.value}</span>
              </div>
              <Progress value={item.percentage} className="h-2" />
              <div className="text-xs text-muted-foreground">{item.description}</div>
            </div>
          ))}
        </div>
        
        <div className="pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Growth Rate: +15% this month
          </div>
        </div>
      </CardContent>
    </Card>
  )
}