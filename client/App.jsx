import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'tell-me-everything-todos';

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function App() {
  const [todos, setTodos] = useState(loadTodos);
  const [input, setInput] = useState('');

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  function addTodo(e) {
    e.preventDefault();
    const title = input.trim();
    if (!title) return;
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), title, completed: false },
    ]);
    setInput('');
  }

  function toggleTodo(id) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function deleteTodo(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 360, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Todo list</h1>
      <form onSubmit={addTodo} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What to do?"
          style={{ flex: 1, padding: 8 }}
          aria-label="New todo"
        />
        <button type="submit">Add</button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 0',
              borderBottom: '1px solid #eee',
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
            />
            <span
              style={{
                flex: 1,
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#888' : 'inherit',
              }}
            >
              {todo.title}
            </span>
            <button
              type="button"
              onClick={() => deleteTodo(todo.id)}
              aria-label={`Delete "${todo.title}"`}
              style={{ padding: '4px 8px' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && (
        <p style={{ color: '#888' }}>No todos yet. Add one above.</p>
      )}
    </div>
  );
}

export default App;
