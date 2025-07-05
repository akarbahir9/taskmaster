import React from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-semibold text-gray-900">Ecommerce Dashboard</h1>
            <nav className="flex space-x-4">
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
              <a href="/dashboard/orders" className="text-gray-600 hover:text-gray-900">Orders</a>
              <a href="/dashboard/products" className="text-gray-600 hover:text-gray-900">Products</a>
              <a href="/dashboard/customers" className="text-gray-600 hover:text-gray-900">Customers</a>
            </nav>
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}