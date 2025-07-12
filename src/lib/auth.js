const API_BASE_URL = "https://stg-brainloop.api.midaytech.com/api/v1";

async function apiCall(endpoint, payload) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || `API call to ${endpoint} failed.`);
  }

  return data;
}

export function loginUser(email, password) {
  return apiCall("/auth/login", { email, password });
}

export function registerUser(username, email, password) {
  return apiCall("/auth/register", { username, email, password });
}
