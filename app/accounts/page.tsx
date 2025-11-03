"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Plus, Edit2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAccounts, createAccount } from "@/services/api"


type AccountApi = {
  id: string;
  name: string;
  balance: number;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<AccountApi[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [newAccount, setNewAccount] = useState<{
    name: string
    balance: number
  }>({
    name: "",
    balance: 0,
  })

  useEffect(() => {
    async function load() {
      try {
        const data = await getAccounts();
        setAccounts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [])

  const handleAddAccount = async () => {
    if (!newAccount.name.trim()) return
    try {
      const created = await createAccount({ name: newAccount.name, balance: newAccount.balance });
      setAccounts((prev) => [...prev, created]);
      setNewAccount({
        name: "",
        balance: 0,
      });
      setOpen(false);
    } catch (err) {
      console.error(err);
      // Optionally show error to user
    }
  }

  async function deleteAccountApi(id: string) {
    const token = localStorage.getItem("moneta_token");
    if (!token) throw new Error("Usuário não autenticado.");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5075"}/api/account/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token.replace(/^Bearer\s+/i, "")}` },
    });
    if (!res.ok) throw new Error("Erro ao excluir conta");
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this account?")) {
      try {
        await deleteAccountApi(id);
        setAccounts((prev) => prev.filter((a) => a.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  }

  const handleCloseDialog = () => {
    setOpen(false)
    setNewAccount({
      name: "",
      balance: 0,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <p className="text-muted-foreground">Loading accounts...</p>
        </main>
      </div>
    )
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Accounts</h1>
              <p className="text-muted-foreground mt-2">Manage your financial accounts and monitor balances</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <Button onClick={() => setOpen(true)} className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  New Account
                </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Account</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Account Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Savings Account"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="balance">Balance</Label>
                  <Input
                    id="balance"
                    type="number"
                    placeholder="0.00"
                    value={newAccount.balance}
                    onChange={(e) =>
                      setNewAccount({ ...newAccount, balance: Number.parseFloat(e.target.value) || 0 })
                    }
                    className="mt-2"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button onClick={handleAddAccount} className="bg-primary hover:bg-primary/90">
                  Create Account
                </Button>
              </DialogFooter>
            </DialogContent>
            </Dialog>
          </div>

          {/* Summary Card */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Total Balance</CardTitle>
              <CardDescription>Combined balance across all accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">
                ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>

          {/* Accounts Grid */}
          {accounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((account) => (
                <Card key={account.id} className="hover:shadow-lg transition-shadow border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{account.name}</CardTitle>
                      </div>
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: "#6C63FF" }}
                      >
                        {account.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Balance</p>
                      <p
                        className={cn(
                          "text-2xl font-bold",
                          account.balance < 0 ? "text-destructive" : "text-secondary",
                        )}
                      >
                        ${account.balance.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        disabled
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-destructive hover:text-destructive bg-transparent"
                        onClick={() => handleDelete(account.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12">
              <CardContent className="text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">No accounts yet</p>
                <p className="text-muted-foreground text-sm mt-2">Create your first account to get started</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
