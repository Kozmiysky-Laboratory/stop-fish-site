// Shared auth client for the Stop Fish frontend.
//
// API_BASE controls where auth requests are sent.
// - Empty string ("") means "same origin" — use this when the site is served
//   by the Node backend (e.g. http://localhost:3000 during development).
// - When the static site is hosted separately (e.g. GitHub Pages), set this to
//   the full backend URL, for example: "https://api.stop-fish.example".
const API_BASE = "";

async function apiRequest(path, { method = "GET", body } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}/api${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    const error = new Error(
      "Не удалось подключиться к серверу. Проверьте соединение с интернетом."
    );
    error.status = 0;
    error.fields = {};
    error.cause = networkErr;
    throw error;
  }

  let data = null;
  try {
    data = await response.json();
  } catch (parseErr) {
    console.error("Не удалось разобрать ответ сервера как JSON:", parseErr);
  }

  if (!response.ok) {
    const message =
      (data && data.error) || `Ошибка сервера (${response.status}). Попробуйте позже.`;
    const error = new Error(message);
    error.status = response.status;
    error.fields = (data && data.fields) || {};
    throw error;
  }

  return data;
}

const authApi = {
  register: (payload) =>
    apiRequest("/auth/register", { method: "POST", body: payload }),
  login: (payload) =>
    apiRequest("/auth/login", { method: "POST", body: payload }),
  logout: () => apiRequest("/auth/logout", { method: "POST" }),
  me: () => apiRequest("/auth/me"),
};

window.authApi = authApi;
