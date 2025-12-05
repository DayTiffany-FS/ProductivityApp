import { useCallback, useEffect, useState } from 'react';
import storageService, { Task } from '../services/storage';
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Use useCallback to prevent infinite re-renders
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allTasks = await storageService.getAllTasks();
      setTasks(allTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);
  const createTask = async (taskData: Omit<Task, 'id'>) => {
    try {
      const newTask = await storageService.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      throw err;
    }
  };
  const updateTask = async (id: number, updates: Partial<Task>) => {
    try {
      const updatedTask = await storageService.updateTask(id, updates);
      if (updatedTask) {
        setTasks(prev => prev.map(task => 
          task.id === id ? updatedTask : task
        ));
      }
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    }
  };
  const deleteTask = async (id: number) => {
    try {
      const success = await storageService.deleteTask(id);
      if (success) {
        setTasks(prev => prev.filter(task => task.id !== id));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      throw err;
    }
  };
  useEffect(() => {
    const initAndLoad = async () => {
      try {
        await storageService.init();
        await loadTasks();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize storage');
        setLoading(false);
      }
    };
    
    initAndLoad();
  }, [loadTasks]);
  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks: loadTasks, // Stable reference for focus effects
  };
}