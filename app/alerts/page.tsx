"use client"
import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { demoAlerts } from "@/lib/demo-data"
import { cn } from "@/lib/utils"

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(demoAlerts)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [newAlert, setNewAlert] = useState({
    type: "",
    condition: "",
    status: "active",
  })

  const toggleAlert = (id: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, status: alert.status === "active" ? "inactive" : "active" } : alert,
      ),
    )
  }

  const handleCreateAlert = () => {
    console.log("Creating alert:", newAlert)
    setIsAlertOpen(false)
    setNewAlert({
      type: "",
      condition: "",
      status: "active",
    })
  }

  const activeCount = alerts.filter((a) => a.status === "active").length

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-balance">Alerts</h1>
            <p className="text-muted-foreground mt-1">
              Manage your financial alerts and notifications ({activeCount} active)
            </p>
          </div>
          <Dialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Alert</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="alert-type">Alert Type</Label>
                  <Select value={newAlert.type} onValueChange={(value) => setNewAlert({ ...newAlert, type: value })}>
                    <SelectTrigger id="alert-type">
                      <SelectValue placeholder="Select alert type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Budget Limit">Budget Limit</SelectItem>
                      <SelectItem value="Low Balance">Low Balance</SelectItem>
                      <SelectItem value="Goal Deadline">Goal Deadline</SelectItem>
                      <SelectItem value="Large Transaction">Large Transaction</SelectItem>
                      <SelectItem value="Bill Reminder">Bill Reminder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Input
                    id="condition"
                    placeholder="e.g., When balance falls below $500"
                    value={newAlert.condition}
                    onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="threshold">Threshold Amount (optional)</Label>
                  <Input id="threshold" type="number" placeholder="0.00" />
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setIsAlertOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAlert}>Create Alert</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card
              key={alert.id}
              className={cn(
                "border-border/50 shadow-lg hover:shadow-xl transition-all",
                alert.status === "active" && "border-primary/30",
              )}
            >
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                        alert.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                      )}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold">{alert.type}</h3>
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                            alert.status === "active"
                              ? "bg-secondary/10 text-secondary"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {alert.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.condition}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={alert.status === "active"}
                        onCheckedChange={() => toggleAlert(alert.id)}
                        aria-label={`Toggle ${alert.type}`}
                      />
                      <span className="text-sm text-muted-foreground">{alert.status === "active" ? "On" : "Off"}</span>
                    </div>

                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alert Types Info */}
        <Card className="border-border/50 shadow-lg mt-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Alert Types</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-accent/50">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold mb-1">Budget Limit</h4>
                <p className="text-xs text-muted-foreground">Get notified when spending exceeds budget</p>
              </div>

              <div className="p-4 rounded-lg bg-accent/50">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold mb-1">Low Balance</h4>
                <p className="text-xs text-muted-foreground">Alert when account balance is low</p>
              </div>

              <div className="p-4 rounded-lg bg-accent/50">
                <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-chart-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold mb-1">Goal Deadline</h4>
                <p className="text-xs text-muted-foreground">Reminders for approaching goal deadlines</p>
              </div>

              <div className="p-4 rounded-lg bg-accent/50">
                <div className="w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-chart-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold mb-1">Large Transaction</h4>
                <p className="text-xs text-muted-foreground">Notify on unusually large transactions</p>
              </div>

              <div className="p-4 rounded-lg bg-accent/50">
                <div className="w-10 h-10 rounded-lg bg-chart-5/10 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-chart-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold mb-1">Bill Reminder</h4>
                <p className="text-xs text-muted-foreground">Alert when bills are due</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
