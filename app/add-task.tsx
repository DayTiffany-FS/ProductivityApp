import { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, Platform } from "react-native";
import { getDB, initDB } from "../services/db";
import { useRouter } from "expo-router";

export default function AddTask() {
  const [title, setTitle] = useState("");
  const [db, setDb] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS !== "web") {
      initDB()
        .then(() => setDb(getDB()))
        .catch(err => console.log("DB init failed", err));
    }
  }, []);

  const addTask = () => {
    if (!title.trim()) {
      Alert.alert("Please enter a task title");
      return;
    }
    if (!db) return;

    db.transaction((tx: any) => {
      tx.executeSql(
        "INSERT INTO tasks (title, done) VALUES (?, ?);",
        [title, 0],
        () => {
          Alert.alert("Task added!");
          setTitle("");
          router.replace("/"); 
        },
        (_, error) => {
          console.log("DB error:", error);
          return true;
        }
      );
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text>Add a new task:</Text>
      <TextInput
        placeholder="Task title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, width: "100%", marginVertical: 10, padding: 5 }}
      />
      <Button title="Add Task" onPress={addTask} />
    </View>
  );
}