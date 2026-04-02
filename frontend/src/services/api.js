import axios from "axios";

// The base URL of our Spring Boot backend (port 8090)
const api = axios.create({
  baseURL: "http://localhost:8090/api",
  headers: { "Content-Type": "application/json" },
});

// ── REQUEST INTERCEPTOR ──────────────────────────────────
// Before every request, automatically attach the JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── RESPONSE INTERCEPTOR ─────────────────────────────────
// If any request gets 401 (unauthorized), log the user out
api.interceptors.response.use(
  (response) => response, // Success: pass through
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── AUTH API CALLS ────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
};

// ── TRANSACTION API CALLS ─────────────────────────────────
export const transactionAPI = {
  getAll: () => api.get("/transactions"),
  create: (data) => api.post("/transactions", data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  remove: (id) => api.delete(`/transactions/${id}`),
  filter: (params) => api.get("/transactions/filter", { params }),
};

// ── DASHBOARD API CALLS ───────────────────────────────────
export const dashboardAPI = {
  getSummary: () => api.get("/dashboard/summary"),
  getMonthly: (year) => api.get("/dashboard/monthly", { params: { year } }),
  getCategories: () => api.get("/dashboard/categories"),
};

export default api;