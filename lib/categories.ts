export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export const defaultCategories: Category[] = [
  { id: "1", name: "Food", icon: "🍔", color: "#FF6B6B" },
  { id: "2", name: "Transport", icon: "🚗", color: "#4ECDC4" },
  { id: "3", name: "Entertainment", icon: "🎮", color: "#95E1D3" },
  { id: "4", name: "Shopping", icon: "🛍️", color: "#F38181" },
  { id: "5", name: "Bills", icon: "📄", color: "#AA96DA" },
  { id: "6", name: "Health", icon: "🏥", color: "#FCBAD3" },
  { id: "7", name: "Salary", icon: "💰", color: "#00E676" },
  { id: "8", name: "Investment", icon: "📈", color: "#6C63FF" },
]

export function getCategories(): Category[] {
  if (typeof window === "undefined") return defaultCategories

  const stored = localStorage.getItem("moneta_categories")
  if (stored) {
    return JSON.parse(stored)
  }
  return defaultCategories
}

export function getCategoryNames(): string[] {
  return getCategories().map((cat) => cat.name)
}
