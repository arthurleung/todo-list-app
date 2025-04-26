'use client';

import { useAuth } from './context/AuthContext';
import TodoList from './components/TodoList';
import Login from './components/Login';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <TodoList />;
}
