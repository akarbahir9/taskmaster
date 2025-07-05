import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"

const orders = [
  {
    id: "ORD-001",
    customer: {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      avatar: "https://github.com/shadcn.png"
    },
    amount: "$142.50",
    status: "completed",
    date: "2 hours ago"
  },
  {
    id: "ORD-002",
    customer: {
      name: "Michael Chen",
      email: "michael@example.com",
      avatar: "https://github.com/shadcn.png"
    },
    amount: "$89.00",
    status: "processing",
    date: "4 hours ago"
  },
  {
    id: "ORD-003",
    customer: {
      name: "Emma Davis",
      email: "emma@example.com",
      avatar: "https://github.com/shadcn.png"
    },
    amount: "$234.75",
    status: "shipped",
    date: "6 hours ago"
  },
  {
    id: "ORD-004",
    customer: {
      name: "James Wilson",
      email: "james@example.com",
      avatar: "https://github.com/shadcn.png"
    },
    amount: "$67.20",
    status: "pending",
    date: "1 day ago"
  },
  {
    id: "ORD-005",
    customer: {
      name: "Lisa Anderson",
      email: "lisa@example.com",
      avatar: "https://github.com/shadcn.png"
    },
    amount: "$156.80",
    status: "completed",
    date: "2 days ago"
  },
]

const statusColors = {
  completed: "bg-green-100 text-green-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  pending: "bg-yellow-100 text-yellow-800",
}

interface RecentOrdersProps {
  className?: string
}

export function RecentOrders({ className }: RecentOrdersProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest customer orders and their status</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={order.customer.avatar} alt={order.customer.name} />
                    <AvatarFallback>{order.customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{order.customer.name}</div>
                    <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{order.id}</TableCell>
                <TableCell className="font-medium">{order.amount}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColors[order.status as keyof typeof statusColors]}`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{order.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}