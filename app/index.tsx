import { useState, useEffect } from "react";
import { View, Text, FlatList, Platform, ActivityIndicator, Button } from "react-native";
import { getDB, initDB } from "../services/db";
import { router, useFocusEffect } from "expo-router";

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [dbReady, setDbReady] = useState(false);
  const [db, setDb] = useState<any>(null);

  useEffect(() => {
    if (Platform.OS === "web") {
      setDbReady(true);
      return;
    }
    initDB()
      .then(() => {
        const database = getDB();
        setDb(database);
        loadTasks(database);
      })
      .catch(err => console.log("DB init failed", err));
  }, []);

  useFocusEffect(() => {
    if (db) loadTasks(db);
  });

  const loadTasks = (database: any) => {
    database.transaction((tx: any) => {
      tx.executeSql(
        "SELECT * FROM tasks;",
        [],
        (_, { rows }: any) => {
          setTasks(rows._array);
          setDbReady(true);
        },
        (_, error: any) => { console.log("DB error:", error); return true; }
      );
    });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Task List</Text>

      {Platform.OS !== "web" && !dbReady && (
        <View style={{ marginBottom: 10, alignItems: "center" }}>
          <ActivityIndicator size="large" />
          <Text>Loading tasks...</Text>
        </View>
      )}

      {Platform.OS !== "web" && dbReady && (
        <FlatList
          data={tasks}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ padding: 10, borderBottomWidth: 1 }}>
              <Text>{item.title} {item.done ? "(Done)" : ""}</Text>
            </View>
          )}
          ListEmptyComponent={<Text>No tasks yet.</Text>}
        />
      )}

      {Platform.OS === "web" && <Text>SQLite not available on web.</Text>}

      <Button title="Add Task" onPress={() => router.push("/add-task")} />
      <Button title="Settings" onPress={() => router.push("/settings")} />
    </View>
  );
}