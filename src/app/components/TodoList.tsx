'use client';

import { useState } from 'react';
import Todo from './Todo';
import { useFirebaseTodos } from '../hooks/useFirebaseTodos';

export default function TodoList() {
  const { todos, loading, addTodo, deleteTodo, editTodo } = useFirebaseTodos();
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      addTodo(newTodo.trim());
      setNewTodo('');
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <p className="text-center text-gray-700">Loading todos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Arthur&apos;s Awesome To-Do List</h1>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          />
          <button
            onClick={handleAddTodo}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
        <p className="text-center text-gray-700">No todos yet. Add one above!</p>
      )}
    </div>
  );
} 