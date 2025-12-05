import { Platform } from 'react-native';
export interface Task {
  id?: number;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}
// Dynamic proxy that loads the correct storage service based on platform
class StorageProxy {
  private _service: any = null;
  private async getService() {
    if (this._service) return this._service;
    
    if (Platform.OS === 'web') {
      const webStorage = await import('./storage.web');
      this._service = webStorage.default;
    } else {
      const nativeStorage = await import('./storage.native');
      this._service = nativeStorage.default;
    }
    
    return this._service;
  }
  async init(): Promise<void> {
    const service = await this.getService();
    return service.init();
  }
  async getAllTasks(): Promise<Task[]> {
    const service = await this.getService();
    return service.getAllTasks();
  }
  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    const service = await this.getService();
    return service.createTask(task);
  }
  // Proxy all other methods...
}
export default new StorageProxy();