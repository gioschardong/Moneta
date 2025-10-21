export interface Transaction {
  id: string
  date: string
  category: string
  description: string
  amount: number
  type: "income" | "expense"
  account: string
}

export interface Goal {
  id: string
  name: string
  target: number
  current: number
  deadline: string
  color: string
}

export interface Alert {
  id: string
  type: string
  condition: string
  status: "active" | "inactive"
}

export const demoTransactions: Transaction[] = [
  {
    id: "1",
    date: "2025-01-15",
    category: "Salary",
    description: "Monthly Salary",
    amount: 5000,
    type: "income",
    account: "Main Account",
  },
  {
    id: "2",
    date: "2025-01-14",
    category: "Food",
    description: "Grocery Shopping",
    amount: -150,
    type: "expense",
    account: "Main Account",
  },
  {
    id: "3",
    date: "2025-01-13",
    category: "Transport",
    description: "Uber Ride",
    amount: -25,
    type: "expense",
    account: "Main Account",
  },
  {
    id: "4",
    date: "2025-01-12",
    category: "Entertainment",
    description: "Netflix Subscription",
    amount: -15,
    type: "expense",
    account: "Main Account",
  },
  {
    id: "5",
    date: "2025-01-11",
    category: "Shopping",
    description: "Online Purchase",
    amount: -80,
    type: "expense",
    account: "Credit Card",
  },
  {
    id: "6",
    date: "2025-01-10",
    category: "Bills",
    description: "Electricity Bill",
    amount: -120,
    type: "expense",
    account: "Main Account",
  },
  {
    id: "7",
    date: "2025-01-09",
    category: "Food",
    description: "Restaurant",
    amount: -60,
    type: "expense",
    account: "Credit Card",
  },
  {
    id: "8",
    date: "2025-01-08",
    category: "Health",
    description: "Pharmacy",
    amount: -45,
    type: "expense",
    account: "Main Account",
  },
]

export const demoGoals: Goal[] = [
  {
    id: "1",
    name: "Emergency Fund",
    target: 10000,
    current: 6500,
    deadline: "2025-12-31",
    color: "bg-primary",
  },
  {
    id: "2",
    name: "Vacation Trip",
    target: 3000,
    current: 1200,
    deadline: "2025-06-30",
    color: "bg-secondary",
  },
  {
    id: "3",
    name: "New Laptop",
    target: 2000,
    current: 1800,
    deadline: "2025-03-31",
    color: "bg-chart-3",
  },
  {
    id: "4",
    name: "Investment Portfolio",
    target: 15000,
    current: 8500,
    deadline: "2025-12-31",
    color: "bg-chart-4",
  },
]

export const demoAlerts: Alert[] = [
  {
    id: "1",
    type: "Budget Limit",
    condition: "Food expenses > $500/month",
    status: "active",
  },
  {
    id: "2",
    type: "Low Balance",
    condition: "Account balance < $1000",
    status: "active",
  },
  {
    id: "3",
    type: "Goal Deadline",
    condition: "Vacation Trip goal approaching",
    status: "inactive",
  },
  {
    id: "4",
    type: "Large Transaction",
    condition: "Single transaction > $500",
    status: "active",
  },
]

export function calculateMonthlyStats(transactions: Transaction[]) {
  const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const expenses = Math.abs(transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0))

  const balance = income - expenses

  return { income, expenses, balance }
}

export function getCategoryDistribution(transactions: Transaction[]) {
  const expensesByCategory: Record<string, number> = {}

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const amount = Math.abs(t.amount)
      expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + amount
    })

  return Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
  }))
}

export function getMonthlyBalanceData() {
  return [
    { month: "Jul", balance: 3200 },
    { month: "Aug", balance: 3800 },
    { month: "Sep", balance: 4200 },
    { month: "Oct", balance: 4600 },
    { month: "Nov", balance: 4100 },
    { month: "Dec", balance: 4800 },
    { month: "Jan", balance: 5495 },
  ]
}
