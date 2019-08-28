/* eslint-disable */
import { openDB, deleteDB, wrap, unwrap, upgrade } from "idb";
import { DATABASE_NAME } from "config";

class DB {
  constructor() {
    if (!DB.instance) {
      this._db = openDB(DATABASE_NAME, 1, {
        upgrade(db) {
          db.createObjectStore("user", { keyPath: "user_name" });
          db.createObjectStore("forms", {
            keyPath: "id",
            autoIncrement: true
          });
          db.createObjectStore("records");
          db.createObjectStore("fields", {
            keyPath: "id",
            autoIncrement: true
          });
          db.createObjectStore("options");
          db.createObjectStore("system_settings", {
            keyPath: "id",
            autoIncrement: true
          });
        }
      });
      DB.instance = this;
    }

    return DB.instance;
  }

  async put(store, item, key) {
    (await this._db).put(store, { ...item, id: key });
    return (await this._db).get(store, key);
  }

  async bulkAdd(store, records) {
    const isDataArray = Array.isArray(records);
    const tx = (await this._db).transaction(store, "readwrite");
    const collection = tx.objectStore(store);

    (isDataArray ? records : Object.keys(records)).forEach(record =>
      collection.put(isDataArray ? record : records[record])
    );
    await tx.done;

    return (await this._db).getAll(store);
  }
}

const instance = new DB();
Object.freeze(instance);

export default instance;
