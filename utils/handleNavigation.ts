import { Href, router } from 'expo-router';
import { Platform } from 'react-native';
export const handleNavigation = (route: Href) => {
  if (Platform.OS === 'web') {
    // Web: Update URL for better UX
    window.history.pushState(null, '', String(route));
  }
  router.push(route);
};
// To use this, replace Links with TouchableOpacity
// For example:
import { handleNavigation } from '@/utils/navigation';
// Replace your Link + TouchableOpacity with:
<TouchableOpacity 
    style={styles.addButton} 
    onPress={() => handleNavigation('/add-task')}
  >
    <Text style={styles.addButtonText}>+ Add Task</Text>
</TouchableOpacity>