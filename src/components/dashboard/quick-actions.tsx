import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Package, Users, ShoppingCart, Settings, BarChart3 } from "lucide-react"

const actions = [
  {
    title: "Add Product",
    description: "Add new products to your inventory",
    icon: Plus,
    color: "bg-blue-100 text-blue-600"
  },
  {
    title: "Manage Inventory",
    description: "Update stock levels and product details",
    icon: Package,
    color: "bg-green-100 text-green-600"
  },
  {
    title: "View Customers",
    description: "Browse and manage customer accounts",
    icon: Users,
    color: "bg-purple-100 text-purple-600"
  },
  {
    title: "Process Orders",
    description: "Handle pending orders and shipments",
    icon: ShoppingCart,
    color: "bg-orange-100 text-orange-600"
  },
  {
    title: "Analytics",
    description: "View detailed sales and performance reports",
    icon: BarChart3,
    color: "bg-pink-100 text-pink-600"
  },
  {
    title: "Settings",
    description: "Configure store settings and preferences",
    icon: Settings,
    color: "bg-gray-100 text-gray-600"
  }
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Commonly used actions and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="ghost"
            className="h-auto p-3 justify-start"
          >
            <div className={`p-2 rounded-lg mr-3 ${action.color}`}>
              <action.icon className="h-4 w-4" />
            </div>
            <div className="text-left">
              <div className="font-medium text-sm">{action.title}</div>
              <div className="text-xs text-muted-foreground">{action.description}</div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}