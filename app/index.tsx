import { Link, useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { createStyles } from '../styles/createStyles';
import { useTasks, Task } from '../hooks/useTasks';

export default function TasksScreen() {
  const { tasks, loading, error, deleteTask, updateTask, refreshTasks } = useTasks();

  // Generate styles here
  const styles = createStyles();

  // Refresh tasks when screen comes into focus (after navigation)
  useFocusEffect(
    useCallback(() => {
      console.log('Screen focused, refreshing tasks');
      refreshTasks();
    }, [refreshTasks])
  );

  const handleToggleComplete = async (id: number, completed: boolean) => {
    try {
      await updateTask(id, { completed: !completed });
    } catch {
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const handleDeleteTask = async (id: number) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(id);
            } catch {
              Alert.alert('Error', 'Failed to delete task');
            }
          }
        },
      ]
    );
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity 
        style={styles.taskContent}
        onPress={() => handleToggleComplete(item.id!, item.completed)}
      >
        <Text style={[styles.taskTitle, item.completed && styles.completedTask]}>
          {item.title}
        </Text>
        <Text style={styles.taskDescription}>{item.description}</Text>
        <Text style={styles.taskPriority}>Priority: {item.priority}</Text>
      </TouchableOpacity>
      
      <View style={styles.taskActions}>
        <TouchableOpacity onPress={() => handleDeleteTask(item.id!)}>
          <Text style={styles.deleteButton}>🗑️</Text>
        </TouchableOpacity>
        <Text style={styles.taskStatus}>
          {item.completed ? '✅' : '⭕'}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading tasks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={item => item.id?.toString() || ''}
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tasks yet!</Text>
            <Text style={styles.emptySubtext}>Create your first task to get started.</Text>
          </View>
        }
      />
      
      <Link href="/add-task" asChild>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Task</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}