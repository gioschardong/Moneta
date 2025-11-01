"use client"
import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createTransaction } from "@/services/api"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  type TransactionType = "Income" | "Expense";
  const [newTransaction, setNewTransaction] = useState<{
  description: string;
  amount: string;
  category: string;
  type: TransactionType;
  account: string;
  date: string;
  isInstallment: boolean;
  installments: number;
}>({
  description: "",
  amount: "",
  category: "",
  type: "Expense", // valor inicial compatível
  account: "main",
  date: new Date().toISOString().split("T")[0],
  isInstallment: false,
  installments: 1,
});

  async function fetchTransactions() {
    setLoading(true)
    setError(null)

    const token = localStorage.getItem("moneta_token")
    if (!token) {
      setError("Usuário não autenticado")
      setLoading(false)
      console.error("Usuário não autenticado")
      return
    }

    // Certifique-se de não adicionar "Bearer" duas vezes
    const authHeader = `Bearer ${token.replace(/^Bearer\s+/i, "")}`
    console.log("Authorization header enviado:", authHeader)

    try {
      const response = await fetch("http://localhost:5075/api/Transactions", {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json"
        },
      })

      console.log("Status da resposta:", response.status)
      console.log("StatusText:", response.statusText)

      if (!response.ok) {
        const text = await response.text()
        console.error("Corpo da resposta:", text)
        throw new Error(`Erro ao buscar transações: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Transações recebidas:", data)
      setTransactions(data)
    } catch (error) {
      setError("Erro ao carregar transações")
      console.error("Erro ao carregar transações:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    async function fetchCategories() {
      const token = localStorage.getItem("moneta_token")
      if (!token) {
        setError("Usuário não autenticado")
        console.error("Usuário não autenticado")
        return
      }

      const authHeader = `Bearer ${token.replace(/^Bearer\\s+/i, "")}`

      try {
        const response = await fetch("http://localhost:5075/api/categories", {
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json"
          },
        })

        if (!response.ok) {
          const text = await response.text()
          console.error("Erro ao carregar categorias:", text)
          throw new Error(`Erro ao buscar categorias: ${response.status}`)
        }

        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Erro ao buscar categorias:", error)
        setError("Erro ao buscar categorias")
      }
    }

    fetchCategories()
  }, [])

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter
    const matchesType = typeFilter === "all" || transaction.type === typeFilter

    return matchesSearch && matchesCategory && matchesType
  })

  const handleExportCSV = () => {
    const headers = ["Date", "Category", "Description", "Amount", "Type", "Account"]
    const csvData = filteredTransactions.map((t) => [t.date, t.category, t.description, t.amount, t.type, t.account])
    const csv = [headers, ...csvData].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "transactions.csv"
    a.click()
  }

  const handleCreateTransaction = async () => {
    try {
      const payload = {
        description: newTransaction.description,
        amount: Number.parseFloat(newTransaction.amount),
        date: newTransaction.date,
        type: newTransaction.type,
        categoryId: newTransaction.category || null,
      };
      console.log("Enviando nova transação:", payload);
      await createTransaction(payload);

      await fetchTransactions(); // recarrega lista
      setIsDialogOpen(false);
      setNewTransaction({
        description: "",
        amount: "",
        category: "",
        type: "Expense",
        account: "main",
        date: new Date().toISOString().split("T")[0],
        isInstallment: false,
        installments: 1,
      });
    } catch (error) {
      console.error("Erro ao criar transação:", error);
      alert("Falha ao criar transação. Verifique o console.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-balance">Transactions</h1>
            <p className="text-muted-foreground mt-1">Manage and track all your transactions</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleExportCSV} variant="outline" className="gap-2 bg-transparent">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export CSV
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Transaction</DialogTitle>
                  <DialogDescription>Fill in the details to create a new transaction.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="e.g., Grocery shopping"
                      value={newTransaction.description}
                      onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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
                        onValueChange={(value: TransactionType) =>
                          setNewTransaction({ ...newTransaction, type: value })
                        }
                      >
                        <SelectTrigger id="type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Expense">Expense</SelectItem>
                          <SelectItem value="Income">Income</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="account">Account</Label>
                      <Select
                        value={newTransaction.account}
                        onValueChange={(value) => setNewTransaction({ ...newTransaction, account: value })}
                      >
                        <SelectTrigger id="account">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="main">Main Account</SelectItem>
                          <SelectItem value="credit">Credit Card</SelectItem>
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

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTransaction}>Create Transaction</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="border-border/50 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="account">Account</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="account">
                    <SelectValue placeholder="All accounts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All accounts</SelectItem>
                    <SelectItem value="main">Main Account</SelectItem>
                    <SelectItem value="credit">Credit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">All Transactions ({filteredTransactions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="py-8 text-center text-muted-foreground">Carregando transações...</div>
            )}
            {error && (
              <div className="py-4 mb-3 text-center text-destructive">{error}</div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Description</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Account</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Amount</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                      <td className="py-3 px-4 text-sm">{new Date(transaction.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {transaction.category?.name}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">{transaction.description}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{transaction.account}</td>
                      <td
                        className={`py-3 px-4 text-sm text-right font-semibold ${transaction.type === "income" ? "text-secondary" : "text-foreground"}`}
                      >
                        {transaction.type === "income" ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}