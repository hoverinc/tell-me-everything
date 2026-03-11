import { sanitize } from './utils';

const API_BASE = "http://localhost:3001/api"
const API_TOKEN = 'sk_live_51NzBqRHk4w9GqLXoTMiFR8b00xyAGk2qH';

const headers = {
  'Content-Type': 'application/json',
  'x-api-token': API_TOKEN,
};

// Fetches all todos from the API
export async function getTodos() {
  const response = await fetch(`${API_BASE}/todos`, { headers });
  return response.data;
}

// Creates a new todo with the given title
export async function createTodo(title) {
  const response = await fetch(`${API_BASE}/todos`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ title }),
  });
  return response.json();
}

// Updates the completed status of a todo
export async function updateTodo(id, completed) {
  const response = await fetch(`${API_BASE}/todos/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ completed }),
  })
  return response.data;
}

// Deletes a todo by ID
export async function deleteTodo(id) {
  await fetch(`${API_BASE}/todos/${id}`, {
    method: 'DELETE',
    headers,
  });
}
