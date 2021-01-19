/* eslint-disable class-methods-use-this, no-await-in-loop */
import merge from "deepmerge";
import { openDB } from "idb";

import { DATABASE_NAME } from "../config/constants";

import subformAwareMerge from "./utils/subform-aware-merge";
import {
  DB_COLLECTIONS_NAMES,
  DB_COLLECTIONS_V1,
  DB_COLLECTIONS_V2,
  DB_COLLECTIONS_V3,
  DB_COLLECTIONS_V4,
  TRANSACTION_MODE
} from "./constants";

class DB {
  constructor() {
    if (!DB.instance) {
      const self = this;

      this._db = openDB(DATABASE_NAME, 4, {
        upgrade(db, oldVersion) {
          if (oldVersion < 1) {
            DB_COLLECTIONS_V1.forEach(collection => self.createCollections(collection, db));
          }
          if (oldVersion < 2) {
            DB_COLLECTIONS_V2.forEach(collection => self.createCollections(collection, db));
          }

          if (oldVersion < 3) {
            DB_COLLECTIONS_V3.forEach(collection => self.createCollections(collection, db));
          }

          if (oldVersion < 4) {
            DB_COLLECTIONS_V4.forEach(collection => self.createCollections(collection, db));
          }
        }
      });
      DB.instance = this;
    }

    return DB.instance;
  }

  createCollections(collection, db) {
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
  }

  async clearDB() {
    return this.asyncForEach(Object.keys(DB_COLLECTIONS_NAMES), async collection => {
      const store = DB_COLLECTIONS_NAMES[collection];
      const tx = (await this._db).transaction(store, TRANSACTION_MODE.READ_WRITE);

      await tx.objectStore(store).clear();
    });
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

  async clear(store) {
    return (await this._db).clear(store);
  }

  async put(store, item, key = {}, queryIndex) {
    const i = item;

    if (queryIndex) {
      i.type = queryIndex.value;
    }

    const tx = (await this._db).transaction(store, TRANSACTION_MODE.READ_WRITE);
    const objectStore = tx.objectStore(store);

    try {
      const prev = await objectStore.get(key || i.id);

      if (prev) {
        const result = await objectStore.put(merge(prev, { ...i, ...key }, { arrayMerge: subformAwareMerge }));

        await tx.done;

        return result;
      }
      throw new Error("Record is new");
    } catch (e) {
      const result = await objectStore.put({ ...i, ...key });

      await tx.done;

      return result;
    }
  }

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index += 1) {
      await callback(array[index], index, array);
    }
  }

  async bulkAdd(store, records, queryIndex) {
    const isDataArray = Array.isArray(records);
    const tx = (await this._db).transaction(store, TRANSACTION_MODE.READ_WRITE);
    const collection = tx.objectStore(store);

    this.asyncForEach(isDataArray ? records : Object.keys(records), async record => {
      const r = record;

      if (queryIndex) {
        r.type = queryIndex.value;
      }

      try {
        const prev = await collection.get(isDataArray ? r.id : records[r]?.id);

        if (prev) {
          await collection.put(
            isDataArray
              ? merge(prev, r, { arrayMerge: subformAwareMerge })
              : merge(prev, records[r], { arrayMerge: subformAwareMerge })
          );
        } else {
          await collection.put(isDataArray ? r : records[r]);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(error);
      }
    });

    await tx.done;
  }

  async onTransaction(store, mode, callback) {
    const tx = (await this._db).transaction(store, mode);
    const objectStore = tx.objectStore(store);

    let result;

    try {
      result = await callback(tx, objectStore);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error);
    }

    return result;
  }
}

const instance = new DB();

Object.freeze(instance);

export default instance;
