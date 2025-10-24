const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5075";

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Erro ${res.status}: ${error}`);
  }

  const data = await res.json();

  // Armazena somente a string do token JWT
  if (data.token && typeof data.token === "string") {
    localStorage.setItem("moneta_token", data.token); // <--- correto
  }

  return data;
}

export async function getTransactions() {
  const token = localStorage.getItem("moneta_token");
  if (!token) throw new Error("Usuário não autenticado.");

  const res = await fetch(`${API_URL}/api/transactions`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.replace(/^Bearer\s+/i, "")}`,
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Erro ${res.status}: ${error}`);
  }

  return res.json();
}

export async function createTransaction(transaction: {
  description: string;
  amount: number;
  categoryId?: string | null;
  
  date: string;
  type: "Income" | "Expense";
}) {
  const token = localStorage.getItem("moneta_token");
  if (!token) throw new Error("Usuário não autenticado.");

  const res = await fetch("http://localhost:5075/api/Transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.replace(/^Bearer\s+/i, "")}`,
    },
    body: JSON.stringify(transaction),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Erro ${res.status}: ${error}`);
  }

  return res.json();
}

export async function getGoals() {
  const token = localStorage.getItem("moneta_token");
  if (!token) throw new Error("Usuário não autenticado.");

  const res = await fetch(`${API_URL}/api/goal`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.replace(/^Bearer\s+/i, "")}`,
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Erro ${res.status}: ${error}`);
  }

  return res.json();
}

export async function register(email: string, password: string, fullName: string) {
  const res = await fetch("http://localhost:5075/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, fullName }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Registration failed: ${error}`);
  }

  const data = await res.json();
  
  // Retorna os dados do usuário criado (não retorna token)
  return data;
}
