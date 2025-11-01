"use client"
import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { getCategoryNames } from "@/lib/categories"
import {
  demoGoals,
  calculateMonthlyStats,
  getCategoryDistribution,
  getMonthlyBalanceData,
} from "@/lib/demo-data"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

const COLORS = ["#6C63FF", "#00E676", "#4FC3F7", "#FFD54F", "#FF6B6B"]

interface Transaction {
  id: string
  date: string
  category: { name: string }
  description: string
  amount: number
  type: "income" | "expense"
}

export default function DashboardPage() {
  const [isTransactionOpen, setIsTransactionOpen] = useState(false)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    type: "expense",
    category: "",
    account: "",
    date: new Date().toISOString().split("T")[0],
    isInstallment: false,
    installments: 1,
  })

  useEffect(() => {
    const categoryStrings: string[] = getCategoryNames()
    const categoryObjects: { id: string; name: string }[] = categoryStrings.map((name, index) => ({
      id: index.toString(),
      name,
    }))
    setCategories(categoryObjects)
  }, [])

  const stats = calculateMonthlyStats([])
  const categoryData = getCategoryDistribution([])
  const balanceData = getMonthlyBalanceData()
  const goalProgress = (demoGoals[0].current / demoGoals[0].target) * 100

  const handleCreateTransaction = () => {
    if (newTransaction.isInstallment && newTransaction.installments > 1) {
      const installmentAmount = Number.parseFloat(newTransaction.amount) / newTransaction.installments
      const baseDate = new Date(newTransaction.date)

      for (let i = 0; i < newTransaction.installments; i++) {
        const installmentDate = new Date(baseDate)
        installmentDate.setMonth(installmentDate.getMonth() + i)

        console.log(`Creating installment ${i + 1}/${newTransaction.installments}:`, {
          ...newTransaction,
          amount: installmentAmount.toFixed(2),
          description: `${newTransaction.description} (${i + 1}/${newTransaction.installments})`,
          date: installmentDate.toISOString().split("T")[0],
        })
      }
    } else {
      console.log("Creating transaction:", newTransaction)
    }

    setIsTransactionOpen(false)
    setNewTransaction({
      description: "",
      amount: "",
      type: "expense",
      category: "",
      account: "",
      date: new Date().toISOString().split("T")[0],
      isInstallment: false,
      installments: 1,
    })
  }

  const transactions: Transaction[] = [
    {
      id: "1",
      date: "2025-10-25",
      category: { name: "Groceries" },
      description: "Supermarket purchase",
      amount: 120.5,
      type: "expense",
    },
    {
      id: "2",
      date: "2025-10-26",
      category: { name: "Salary" },
      description: "Monthly salary",
      amount: 3500,
      type: "income",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      {/* Main Container */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Balance"
            value={`$${stats.balance.toLocaleString()}`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            trend={{ value: "+12.5%", positive: true }}
          />

          <StatCard
            title="Monthly Income"
            value={`$${stats.income.toLocaleString()}`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            trend={{ value: "+8.2%", positive: true }}
          />

          <StatCard
            title="Monthly Expenses"
            value={`$${stats.expenses.toLocaleString()}`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6 6"
                />
              </svg>
            }
            trend={{ value: "-3.1%", positive: true }}
          />

          <StatCard
            title="Goal Progress"
            value={`${goalProgress.toFixed(0)}%`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"
                />
              </svg>
            }
            trend={{ value: "+15%", positive: true }}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={(data: any) => {
                      const name = data.name as string
                      const percent = data.percent as number
                      return `${name} ${(percent * 100).toFixed(0)}%`
                    }}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Line Chart */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Balance Evolution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={balanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`$${value}`, "Balance"]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#6C63FF"
                    strokeWidth={3}
                    dot={{ fill: "#6C63FF", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Description</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                      <td className="py-3 px-4 text-sm">{new Date(transaction.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {transaction.category.name}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">{transaction.description}</td>
                      <td
                        className={`py-3 px-4 text-sm text-right font-semibold ${
                          transaction.type === "income" ? "text-secondary" : "text-foreground"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Floating Action Button */}
        <Dialog open={isTransactionOpen} onOpenChange={setIsTransactionOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-2xl hover:shadow-primary/50 transition-all"
              aria-label="Add new transaction"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>New Transaction</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Enter description"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newTransaction.type}
                  onValueChange={(value) => setNewTransaction({ ...newTransaction, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newTransaction.category}
                  onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="account">Account</Label>
                <Select
                  value={newTransaction.account}
                  onValueChange={(value) => setNewTransaction({ ...newTransaction, account: value })}
                >
                  <SelectTrigger id="account">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Checking">Checking</SelectItem>
                    <SelectItem value="Savings">Savings</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t border-border">
                <Checkbox
                  id="installment"
                  checked={newTransaction.isInstallment}
                  onCheckedChange={(checked) =>
                    setNewTransaction({ ...newTransaction, isInstallment: checked as boolean })
                  }
                />
                <Label htmlFor="installment" className="text-sm font-normal cursor-pointer">
                  Installment purchase (parcelado)
                </Label>
              </div>

              {newTransaction.isInstallment && (
                <div className="grid gap-2">
                  <Label htmlFor="installments">Number of Installments</Label>
                  <Input
                    id="installments"
                    type="number"
                    min="2"
                    max="48"
                    placeholder="2"
                    value={newTransaction.installments}
                    onChange={(e) =>
                      setNewTransaction({ ...newTransaction, installments: Number.parseInt(e.target.value) || 1 })
                    }
                  />
                  {newTransaction.amount && newTransaction.installments > 1 && (
                    <p className="text-sm text-muted-foreground">
                      {newTransaction.installments}x of $
                      {(Number.parseFloat(newTransaction.amount) / newTransaction.installments).toFixed(2)}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsTransactionOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTransaction}>Create Transaction</Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
