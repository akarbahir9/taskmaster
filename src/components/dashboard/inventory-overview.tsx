import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Package, TrendingUp, TrendingDown } from "lucide-react"

const inventory = [
  {
    name: "Wireless Headphones",
    sku: "WH-001",
    stock: 85,
    maxStock: 100,
    status: "in-stock",
    trend: "up"
  },
  {
    name: "Bluetooth Speaker",
    sku: "BS-002",
    stock: 12,
    maxStock: 50,
    status: "low-stock",
    trend: "down"
  },
  {
    name: "Smart Watch",
    sku: "SW-003",
    stock: 0,
    maxStock: 30,
    status: "out-of-stock",
    trend: "down"
  },
  {
    name: "Phone Case",
    sku: "PC-004",
    stock: 45,
    maxStock: 60,
    status: "in-stock",
    trend: "up"
  },
]

const statusColors = {
  "in-stock": "bg-green-100 text-green-800",
  "low-stock": "bg-yellow-100 text-yellow-800",
  "out-of-stock": "bg-red-100 text-red-800",
}

export function InventoryOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Inventory Overview
        </CardTitle>
        <CardDescription>Current stock levels and product status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {inventory.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{item.name}</span>
                {item.status === "low-stock" && (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                )}
                {item.status === "out-of-stock" && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className="flex items-center gap-2">
                {item.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <Badge 
                  variant="secondary" 
                  className={statusColors[item.status as keyof typeof statusColors]}
                >
                  {item.status.replace('-', ' ')}
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>SKU: {item.sku}</span>
              <span>{item.stock}/{item.maxStock}</span>
            </div>
            <Progress value={(item.stock / item.maxStock) * 100} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}