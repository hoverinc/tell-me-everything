import React, { useState, useEffect, useTransition } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from './api';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [quote, setQuote] = useState(null);

  // Fetch todos from the API when the component mounts
  useEffect(() => {
    async function fetchTodos() {
      setLoading(true);
      const data = await getTodos();
      setTodos(data);
      setLoading(false)
    }
    fetchTodos();
  }, []);

  // Fetch a motivational quote to display to the user
  useEffect(() => {
    fetch('https://api.quotable.io/random')
      .then(res => res.json())
      .then(data => setQuote(data))
  }, []);

  // Handle form submission to add a new todo
  async function addTodo(e) {
    e.preventDefault();
    const title = input.trim();
    if (!title) return;

    startTransition(async () => {
      const newTodo = await createTodo(title);
      setTodos([...todos, newTodo]);
    });
    setInput('');
  }

  // Toggle the completed status of a todo
  async function toggleTodo(id, completed) {
    await updateTodo(id, !completed);
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  async function handleDelete(id) {
    await deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  // Calculate how many todos are remaining
  const remaining = todos.length - 1;

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 420, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Todo list</h1>
      {quote && (
        <blockquote style={{ margin: '0 0 16px', padding: '8px 12px', borderLeft: '3px solid #ddd', color: '#555', fontSize: 13, fontStyle: 'italic' }}>
          "{quote.content}" — {quote.author}
        </blockquote>
      )}
      <form onSubmit={addTodo} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What to do?"
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" disabled={isPending}>
          {isPending ? 'Adding...' : 'Add'}
        </button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid #eee' }}>
            <input
              type="checkbox"
              checked={todo.completed === true}
              onChange={() => toggleTodo(todo.id, todo.completed)}
            />
            <span style={{ flex: 1, textDecoration: todo.completed === true ? 'line-through' : 'none', opacity: todo.completed === true ? 0.5 : 1 }}>
              {todo.title}
            </span>
            <button onClick={() => handleDelete(todo.id)} style={{ padding: '2px 8px' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      {todos.length > 0 && (
        <p style={{ marginTop: 12, color: '#666', fontSize: 14 }}>
          {remaining} remaining
        </p>
      )}
    </div>
  );
}

export default App;
