'use client';

import { useState } from 'react';
import Todo from './Todo';

interface TodoItem {
  id: number;
  text: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo.trim()
        }
      ]);
      setNewTodo('');
    }
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (id: number, newText: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Arthur&apos;s To-Do List</h1>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTodo}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>
      </div>
      
      <ul className="space-y-2">
        {todos.map(todo => (
          <Todo
            key={todo.id}
            id={todo.id}
            text={todo.text}
            onDelete={deleteTodo}
            onEdit={editTodo}
          />
        ))}
      </ul>
      
      {todos.length === 0 && (
        <p className="text-center text-gray-500">No todos yet. Add one above!</p>
      )}
    </div>
  );
} 