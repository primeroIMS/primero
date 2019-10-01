/* eslint-disable class-methods-use-this, no-await-in-loop */
import { openDB } from "idb";
import { DATABASE_NAME, DB as DBCollections } from "config";
import merge from "deepmerge";

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

  async clearDB() {
    return this.asyncForEach(Object.keys(DBCollections), async collection => {
      const store = DBCollections[collection];
      const tx = (await this._db).transaction(store, "readwrite");
      await tx.objectStore(store).clear();
    });
  }

  async getRecord(store, key) {
    return (await this._db).get(store, key);
  }

  async put(store, item, key = {}, queryIndex) {
    const i = item;

    if (queryIndex) {
      i.type = queryIndex.value;
    }

    try {
      const prev = await (await this._db).get(store, key || i.id);

      if (prev) {
        return (await this._db).put(store, merge(prev, { ...i, ...key }));
      }
    } catch (e) {
      return (await this._db).put(store, { ...i, ...key });
    }

    return true;
  }

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index += 1) {
      await callback(array[index], index, array);
    }
  }

  async bulkAdd(store, records, queryIndex) {
    const isDataArray = Array.isArray(records);
    const tx = (await this._db).transaction(store, "readwrite");
    const collection = tx.objectStore(store);

    this.asyncForEach(
      isDataArray ? records : Object.keys(records),
      async record => {
        const r = record;

        if (queryIndex) {
          r.type = queryIndex.value;
        }

        try {
          const prev = (await this._db).get(
            store,
            isDataArray ? r.id : records[r]?.id
          );

          if (prev) {
            await collection.put(
              isDataArray ? merge(prev, r) : merge(prev, records[r])
            );
          }
        } catch (e) {
          await collection.put(isDataArray ? r : records[r]);
        }
      }
    );

    await tx.done;
  }
}

const instance = new DB();
Object.freeze(instance);

export default instance;
