"use client"
import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { demoGoals } from "@/lib/demo-data"
import { cn } from "@/lib/utils"

export default function GoalsPage() {
  const [isGoalOpen, setIsGoalOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({
    name: "",
    target: "",
    current: "",
    deadline: "",
  })

  const handleCreateGoal = () => {
    console.log("Creating goal:", newGoal)
    setIsGoalOpen(false)
    setNewGoal({
      name: "",
      target: "",
      current: "",
      deadline: "",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-balance">Financial Goals</h1>
            <p className="text-muted-foreground mt-1">Track your progress towards your financial objectives</p>
          </div>
          <Dialog open={isGoalOpen} onOpenChange={setIsGoalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="goal-name">Goal Name</Label>
                  <Input
                    id="goal-name"
                    placeholder="e.g., Emergency Fund"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="target">Target Amount</Label>
                  <Input
                    id="target"
                    type="number"
                    placeholder="0.00"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="current">Current Amount</Label>
                  <Input
                    id="current"
                    type="number"
                    placeholder="0.00"
                    value={newGoal.current}
                    onChange={(e) => setNewGoal({ ...newGoal, current: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setIsGoalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateGoal}>Create Goal</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demoGoals.map((goal) => {
            const progress = (goal.current / goal.target) * 100
            const isCompleted = progress >= 100
            const daysLeft = Math.ceil(
              (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
            )

            return (
              <Card
                key={goal.id}
                className={cn(
                  "border-border/50 shadow-lg hover:shadow-xl transition-all",
                  isCompleted && "border-secondary/50",
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-balance mb-1">{goal.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {daysLeft > 0 ? `${daysLeft} days remaining` : "Deadline passed"}
                      </p>
                    </div>
                    {isCompleted && (
                      <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl font-bold">${goal.current.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">of ${goal.target.toLocaleString()}</span>
                    </div>

                    <Progress value={Math.min(progress, 100)} className="h-3" />

                    <div className="flex justify-between items-center">
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          isCompleted ? "text-secondary" : "text-muted-foreground",
                        )}
                      >
                        {progress.toFixed(1)}% Complete
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Due: {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Add Funds
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Summary Card */}
        <Card className="border-border/50 shadow-lg mt-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Goals Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Goals</p>
                <p className="text-2xl font-bold">{demoGoals.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Target</p>
                <p className="text-2xl font-bold">
                  ${demoGoals.reduce((sum, goal) => sum + goal.target, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Saved</p>
                <p className="text-2xl font-bold text-secondary">
                  ${demoGoals.reduce((sum, goal) => sum + goal.current, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
