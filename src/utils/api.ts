const API_BASE_URL = "/api";

export const api = {
  register: (data: any) =>
    fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  login: (data: any) =>
    fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  getProfile: (token: string) =>
    fetch(`${API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  addResult: (data: any, token: string) =>
    fetch(`${API_BASE_URL}/result/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

  getResults: (token: string) =>
    fetch(`${API_BASE_URL}/result/user`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  calculateCGPA: (data: any, token?: string) =>
    fetch(`${API_BASE_URL}/cgpa/calculate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    }),

  addFeedback: (data: any) =>
    fetch(`${API_BASE_URL}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  getAllFeedback: () =>
    fetch(`${API_BASE_URL}/feedback`, {
      method: "GET",
    }),

  getAllUsers: (token: string) =>
    fetch(`${API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};
