import * as SQLite from 'expo-sqlite';
export interface Task {
  id?: number;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}
class NativeStorageService {
  private db: SQLite.SQLiteDatabase | null = null;
  async init(): Promise<void> {
    try {
      const dbName = 'cda_tasks_mobile.db';
      this.db = await SQLite.openDatabaseAsync(dbName);
      await this.createTables();
      console.log('SQLite database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }
  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        completed INTEGER DEFAULT 0,
        priority TEXT DEFAULT 'medium',
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);
    await this.db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
    `);
  }
  async getAllTasks(): Promise<Task[]> {
    if (!this.db) throw new Error('Database not initialized');
    const result = await this.db.getAllAsync(`
      SELECT * FROM tasks ORDER BY createdAt DESC
    `);
    return result.map(row => ({
      ...row,
      completed: Boolean((row as any).completed),
    })) as Task[];
  }
  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    if (!this.db) throw new Error('Database not initialized');
    const now = new Date().toISOString();
    const taskWithTimestamps = {
      ...task,
      createdAt: now,
      updatedAt: now,
    };
    
    const result = await this.db.runAsync(`
      INSERT INTO tasks (title, description, completed, priority, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      taskWithTimestamps.title,
      taskWithTimestamps.description,
      taskWithTimestamps.completed ? 1 : 0,
      taskWithTimestamps.priority,
      taskWithTimestamps.createdAt,
      taskWithTimestamps.updatedAt,
    ]);
    
    return {
      ...taskWithTimestamps,
      id: result.lastInsertRowId,
    };
  }
  // Additional CRUD methods...
}
export default new NativeStorageService();