import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  onSnapshot,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAnalytics } from './useAnalytics';
import { useAuth } from '../context/AuthContext';

interface TodoItem {
  id: string;
  text: string;
  createdAt: Date;
  userId: string;
}

export function useFirebaseTodos() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { logTodoEvent } = useAnalytics();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setTodos([]);
      setLoading(false);
      return;
    }

    // Create a query to get todos for the current user, ordered by creation date
    const q = query(
      collection(db, 'todos'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todosData = snapshot.docs.map(doc => ({
        id: doc.id,
        text: doc.data().text,
        createdAt: doc.data().createdAt.toDate(),
        userId: doc.data().userId
      }));
      setTodos(todosData);
      setLoading(false);
    });

    // Clean up listener on unmount
    return () => unsubscribe();
  }, [user]);

  const addTodo = async (text: string) => {
    if (!user) return;
    
    try {
      const docRef = await addDoc(collection(db, 'todos'), {
        text,
        createdAt: new Date(),
        userId: user.uid
      });
      logTodoEvent('add_todo', docRef.id, text);
    } catch (error) {
      console.error('Error adding todo: ', error);
    }
  };

  const deleteTodo = async (id: string) => {
    if (!user) return;

    try {
      const todo = todos.find(t => t.id === id);
      if (todo && todo.userId === user.uid) {
        logTodoEvent('delete_todo', id, todo.text);
        await deleteDoc(doc(db, 'todos', id));
      }
    } catch (error) {
      console.error('Error deleting todo: ', error);
    }
  };

  const editTodo = async (id: string, newText: string) => {
    if (!user) return;

    try {
      const todo = todos.find(t => t.id === id);
      if (todo && todo.userId === user.uid) {
        logTodoEvent('edit_todo', id, newText);
        await updateDoc(doc(db, 'todos', id), {
          text: newText
        });
      }
    } catch (error) {
      console.error('Error updating todo: ', error);
    }
  };

  return { todos, loading, addTodo, deleteTodo, editTodo };
} 