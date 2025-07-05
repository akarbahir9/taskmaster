import React from "react"
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem 
} from "@/components/ui/sidebar"
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Home,
  TrendingUp,
  CreditCard,
  FileText,
  HelpCircle
} from "lucide-react"

const navigationItems = [
  { title: "Dashboard", icon: Home, url: "/dashboard" },
  { title: "Analytics", icon: BarChart3, url: "/dashboard/analytics" },
  { title: "Orders", icon: ShoppingCart, url: "/dashboard/orders" },
  { title: "Products", icon: Package, url: "/dashboard/products" },
  { title: "Customers", icon: Users, url: "/dashboard/customers" },
  { title: "Reports", icon: FileText, url: "/dashboard/reports" },
]

const secondaryItems = [
  { title: "Sales", icon: TrendingUp, url: "/dashboard/sales" },
  { title: "Payments", icon: CreditCard, url: "/dashboard/payments" },
  { title: "Settings", icon: Settings, url: "/dashboard/settings" },
  { title: "Help", icon: HelpCircle, url: "/dashboard/help" },
]

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-6">
        <h1 className="text-2xl font-bold">Ecommerce</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-4 py-6">
        <div className="text-sm text-muted-foreground">
          © 2024 Ecommerce Dashboard
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}