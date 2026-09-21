const API_URL = "http://localhost:8000";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let message = "Something went wrong";

    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // Ignore JSON parsing errors
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const getItems = () => request("/items");

export const getItem = (id) => request(`/items/${id}`);

export const createItem = (item) =>
  request("/items", {
    method: "POST",
    body: JSON.stringify(item),
  });

export const updateItem = (id, item) =>
  request(`/items/${id}`, {
    method: "PUT",
    body: JSON.stringify(item),
  });

export const deleteItem = (id) =>
  request(`/items/${id}`, {
    method: "DELETE",
  });