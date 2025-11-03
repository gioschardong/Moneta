export interface Account {
  id: string
  name: string
  type: "checking" | "savings" | "credit_card" | "investment"
  balance: number
  currency: string
  color: string
}

const DEFAULT_ACCOUNTS: Account[] = [
  {
    id: "1",
    name: "Main Account",
    type: "checking",
    balance: 5495,
    currency: "USD",
    color: "#6C63FF",
  },
  {
    id: "2",
    name: "Credit Card",
    type: "credit_card",
    balance: -320,
    currency: "USD",
    color: "#00E676",
  },
]

export function getAccounts(): Account[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("financeflow_accounts")
  return stored ? JSON.parse(stored) : DEFAULT_ACCOUNTS
}

export function saveAccounts(accounts: Account[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem("financeflow_accounts", JSON.stringify(accounts))
}

export function addAccount(account: Omit<Account, "id">): Account {
  const accounts = getAccounts()
  const newAccount: Account = {
    ...account,
    id: Date.now().toString(),
  }
  accounts.push(newAccount)
  saveAccounts(accounts)
  return newAccount
}

export function updateAccount(id: string, updates: Partial<Account>): void {
  const accounts = getAccounts()
  const index = accounts.findIndex((a) => a.id === id)
  if (index !== -1) {
    accounts[index] = { ...accounts[index], ...updates }
    saveAccounts(accounts)
  }
}

export function deleteAccount(id: string): void {
  const accounts = getAccounts()
  const filtered = accounts.filter((a) => a.id !== id)
  saveAccounts(filtered)
}

export function getAccountNames(): string[] {
  return getAccounts().map((a) => a.name)
}
