import { openDB } from "idb";
import { DATABASE_NAME } from "config";

class DB {
  constructor() {
    if (!DB.instance) {
      this._db = openDB(DATABASE_NAME, 1, {
        upgrade(db) {
          const recordStores = db.createObjectStore("records", {
            keyPath: "id"
          });

          db.createObjectStore("user", { keyPath: "user_name" });
          db.createObjectStore("forms", {
            keyPath: "id",
            autoIncrement: true
          });
          db.createObjectStore("fields", {
            keyPath: "id",
            autoIncrement: true
          });
          db.createObjectStore("options");
          db.createObjectStore("system_settings", {
            keyPath: "id",
            autoIncrement: true
          });

          recordStores.createIndex("type", "type", { multiEntry: true });
        }
      });
      DB.instance = this;
    }

    return DB.instance;
  }

  async put(store, item, key = {}) {
    (await this._db).put(store, { ...item, ...key });
    return (await this._db).get(store, Object.keys({ key })[0] || null);
  }

  async bulkAdd(store, records, queryIndex) {
    const isDataArray = Array.isArray(records);
    const tx = (await this._db).transaction(store, "readwrite");
    const collection = tx.objectStore(store);

    (isDataArray ? records : Object.keys(records)).forEach(record => {
      const r = record;

      if (queryIndex) {
        r.type = queryIndex.value;
      }

      collection.put(isDataArray ? r : records[r]);
    });
    await tx.done;

    if (queryIndex) {
      const { index, value } = queryIndex;
      return (await this._db).getAllFromIndex(store, index, value);
    }

    return (await this._db).getAll(store);
  }
}

const instance = new DB();
Object.freeze(instance);

export default instance;
