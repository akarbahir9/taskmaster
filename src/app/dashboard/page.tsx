import React from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { SalesChart } from "@/components/dashboard/sales-chart-simple"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { InventoryOverview } from "@/components/dashboard/inventory-overview"
import { CustomerInsights } from "@/components/dashboard/customer-insights-simple"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <DashboardHeader />
      <DashboardStats />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <SalesChart className="col-span-4" />
        <CustomerInsights className="col-span-3" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <RecentOrders className="col-span-4" />
        <div className="col-span-3 space-y-6">
          <InventoryOverview />
          <QuickActions />
        </div>
      </div>
    </div>
  )
}