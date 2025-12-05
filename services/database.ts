import { Platform } from "react-native";

let SQLite: any;
if (Platform.OS !== "web") {
  SQLite = require("expo-sqlite");
}

let db: any = null;

export const getDB = () => db;

export const initDB = async () => {
  if (Platform.OS === "web") return;
  if (!db) {
    if (!SQLite) throw new Error("SQLite not available on this platform");
    db = SQLite.openDatabase("tasks.db");
    await new Promise<void>((resolve, reject) => {
      db.transaction(
        (tx: any) => {
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, done INT);"
          );
        },
        (err: any) => reject(err),
        () => resolve()
      );
    });
  }
};