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
  if (data.token) localStorage.setItem("moneta_token", data.token);
  return data;
}

export async function getTransactions() {
  const token = localStorage.getItem("moneta_token");
  if (!token) throw new Error("Usuário não autenticado.");

  const res = await fetch(`${API_URL}/api/transactions`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Erro ${res.status}: ${error}`);
  }

  return res.json();
}