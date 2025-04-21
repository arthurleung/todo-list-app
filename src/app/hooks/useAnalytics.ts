import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase/config';

type TodoEvent = 'add_todo' | 'edit_todo' | 'delete_todo';

export function useAnalytics() {
  const logTodoEvent = (eventName: TodoEvent, todoId: string, text?: string) => {
    logEvent(analytics, eventName, {
      todo_id: todoId,
      todo_text: text,
      timestamp: new Date().toISOString()
    });
  };

  return { logTodoEvent };
} 