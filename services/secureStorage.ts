import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
class SecureStorageService {
  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Enhanced web fallback with encryption consideration
        try {
          // Use sessionStorage for temporary sensitive data
          sessionStorage.setItem(key, value);
        } catch {
          // Fallback to localStorage if sessionStorage fails
          localStorage.setItem(key, value);
        }
      } else {
        await SecureStore.setItemAsync(key, value, {
          requireAuthentication: false, // Set to true for biometric protection
        });
      }
    } catch (error) {
      console.error('Error storing secure item:', error);
      throw error;
    }
  }
  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return sessionStorage.getItem(key) || localStorage.getItem(key);
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.error('Error retrieving secure item:', error);
      return null;
    }
  }
  async deleteItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        sessionStorage.removeItem(key);
        localStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error('Error deleting secure item:', error);
      throw error;
    }
  }
}
export default new SecureStorageService();