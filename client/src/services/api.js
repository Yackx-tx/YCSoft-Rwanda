const API_BASE = "http://localhost:8000/api";

// Helper to get auth headers
export function authHeader() {
  const token = localStorage.getItem("token");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

// Register
export async function register(name, email, password, role) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });
  return res.json();
}

// Login
export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

// Create product (Admin only)
export async function createProduct(productData) {
  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(productData),
  });
  return res.json();
}

// Get all products
export async function getProducts() {
  const res = await fetch(`${API_BASE}/products`, {
    method: "GET",
    headers: authHeader(),
  });
  return res.json();
}

// Update product (Admin only)
export async function updateProduct(id, productData) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify(productData),
  });
  return res.json();
}

// Delete product (Admin only)
export async function deleteProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  return res.json();
}

// Get dashboard stats (Admin only)
export async function getDashboard() {
  const res = await fetch(`${API_BASE}/dashboard`, {
    method: "GET",
    headers: authHeader(),
  });
  return res.json();
}

// Create sale (Cashier)
export async function createSale(items) {
  const res = await fetch(`${API_BASE}/sales`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({ items }),
  });
  return res.json();
}

// Get sales
export async function getSales() {
  const res = await fetch(`${API_BASE}/sales`, {
    method: "GET",
    headers: authHeader(),
  });
  return res.json();
}
