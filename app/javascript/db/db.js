/* eslint-disable class-methods-use-this, no-await-in-loop */
import merge from "deepmerge";
import { openDB } from "idb";

import { DATABASE_NAME } from "../config/constants";

import { DB_COLLECTIONS_NAMES, DB_COLLECTIONS } from "./constants";

class DB {
  constructor() {
    if (!DB.instance) {
      this._db = openDB(DATABASE_NAME, 1, {
        upgrade(db) {
          DB_COLLECTIONS.forEach(collection => {
            if (Array.isArray(collection)) {
              const [name, options, index] = collection;

              const store = db.createObjectStore(name, options);

              if (index) store.createIndex(...index);
            } else {
              db.createObjectStore(collection, {
                keyPath: "id",
                autoIncrement: true
              });
            }
          });
        }
      });
      DB.instance = this;
    }

    return DB.instance;
  }

  async clearDB() {
    return this.asyncForEach(
      Object.keys(DB_COLLECTIONS_NAMES),
      async collection => {
        const store = DB_COLLECTIONS_NAMES[collection];
        const tx = (await this._db).transaction(store, "readwrite");

        await tx.objectStore(store).clear();
      }
    );
  }

  async getRecord(store, key) {
    return (await this._db).get(store, key);
  }

  async getAll(store) {
    return (await this._db).getAll(store);
  }

  async getAllFromIndex(store, index, key) {
    return (await this._db).getAllFromIndex(store, index, key);
  }

  async add(store, item) {
    return (await this._db).add(store, item);
  }

  async delete(store, item) {
    return (await this._db).delete(store, item);
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
      throw new Error("Record is new");
    } catch (e) {
      return (await this._db).put(store, { ...i, ...key });
    }
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
