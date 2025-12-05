import AsyncStorage from '@react-native-async-storage/async-storage';
export interface Task {
  id?: number;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}
class WebStorageService {
  private tasksKey = 'cda_tasks';
  private idCounterKey = 'cda_tasks_id_counter';
  async init(): Promise<void> {
    console.log('Web storage initialized');
  }
  private async getTasks(): Promise<Task[]> {
    try {
      const tasksJson = await AsyncStorage.getItem(this.tasksKey);
      return tasksJson ? JSON.parse(tasksJson) : [];
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  }
  private async saveTasks(tasks: Task[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.tasksKey, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
      throw error;
    }
  }
  private async getNextId(): Promise<number> {
    try {
      const counterStr = await AsyncStorage.getItem(this.idCounterKey);
      const counter = counterStr ? parseInt(counterStr, 10) : 1;
      await AsyncStorage.setItem(this.idCounterKey, (counter + 1).toString());
      return counter;
    } catch (error) {
      console.error('Error getting next ID:', error);
      return Date.now();
    }
  }
  async getAllTasks(): Promise<Task[]> {
    const tasks = await this.getTasks();
    return tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    const tasks = await this.getTasks();
    const id = await this.getNextId();
    const now = new Date().toISOString();
    const newTask = { 
      ...task, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    tasks.push(newTask);
    await this.saveTasks(tasks);
    return newTask;
  }
  async updateTask(id: number, updates: Partial<Task>): Promise<Task | null> {
    const tasks = await this.getTasks();
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) return null;
    const updatedTask = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    tasks[index] = updatedTask;
    await this.saveTasks(tasks);
    return updatedTask;
  }
  async deleteTask(id: number): Promise<boolean> {
    const tasks = await this.getTasks();
    const initialLength = tasks.length;
    const filteredTasks = tasks.filter(task => task.id !== id);
    await this.saveTasks(filteredTasks);
    return filteredTasks.length < initialLength;
  }
  // Additional methods...
}
export default new WebStorageService();