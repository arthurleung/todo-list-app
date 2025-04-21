import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAnalytics } from './useAnalytics';

interface TodoItem {
  id: string;
  text: string;
  createdAt: Date;
}

export function useFirebaseTodos() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { logTodoEvent } = useAnalytics();

  useEffect(() => {
    // Create a query to get todos ordered by creation date
    const q = query(collection(db, 'todos'), orderBy('createdAt', 'desc'));
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todosData = snapshot.docs.map(doc => ({
        id: doc.id,
        text: doc.data().text,
        createdAt: doc.data().createdAt.toDate()
      }));
      setTodos(todosData);
      setLoading(false);
    });

    // Clean up listener on unmount
    return () => unsubscribe();
  }, []);

  const addTodo = async (text: string) => {
    try {
      const docRef = await addDoc(collection(db, 'todos'), {
        text,
        createdAt: new Date()
      });
      logTodoEvent('add_todo', docRef.id, text);
    } catch (error) {
      console.error('Error adding todo: ', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (todo) {
        logTodoEvent('delete_todo', id, todo.text);
      }
      await deleteDoc(doc(db, 'todos', id));
    } catch (error) {
      console.error('Error deleting todo: ', error);
    }
  };

  const editTodo = async (id: string, newText: string) => {
    try {
      logTodoEvent('edit_todo', id, newText);
      await updateDoc(doc(db, 'todos', id), {
        text: newText
      });
    } catch (error) {
      console.error('Error updating todo: ', error);
    }
  };

  return { todos, loading, addTodo, deleteTodo, editTodo };
} 