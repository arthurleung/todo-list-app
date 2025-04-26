'use client';

import { useState } from 'react';
import { useFirebaseTodos } from '../hooks/useFirebaseTodos';
import { useAuth } from '../context/AuthContext';
import Todo from './Todo';

export default function TodoList() {
  const [newTodo, setNewTodo] = useState('');
  const { todos, loading, addTodo, deleteTodo, editTodo } = useFirebaseTodos();
  const { user, logout } = useAuth();

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      await addTodo(newTodo);
      setNewTodo('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Doto: To-Do List</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.email}</span>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new todo..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddTodo}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {todos.map((todo) => (
              <Todo
                key={todo.id}
                id={todo.id}
                text={todo.text}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 