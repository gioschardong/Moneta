import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  trend?: {
    value: string
    positive: boolean
  }
  className?: string
}

export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("border-border/50 shadow-lg hover:shadow-xl transition-shadow", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
            <p className="text-3xl font-bold text-balance">{value}</p>
            {trend && (
              <p
                className={cn(
                  "text-sm font-medium mt-2 flex items-center gap-1",
                  trend.positive ? "text-secondary" : "text-destructive",
                )}
              >
                <span>{trend.positive ? "↑" : "↓"}</span>
                {trend.value}
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
