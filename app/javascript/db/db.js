// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import isEmpty from "lodash/isEmpty";
import { openDB } from "idb";
import fuzzysort from "fuzzysort";
import sortBy from "lodash/sortBy";
import uniq from "lodash/uniq";

import { DATABASE_NAME } from "../config";

import recordMerge from "./utils/record-merge";
import {
  DB_COLLECTIONS_NAMES,
  DB_COLLECTIONS_V1,
  DB_COLLECTIONS_V2,
  DB_COLLECTIONS_V3,
  DB_COLLECTIONS_V4,
  DB_COLLECTIONS_V5,
  DB_COLLECTIONS_V6,
  DB_COLLECTIONS_V7,
  TRANSACTION_MODE
} from "./constants";

async function getDB() {
  function createCollections(collection, db, transaction) {
    if (Array.isArray(collection)) {
      const [name, options, index] = collection;

      let store;

      if (db.objectStoreNames && db.objectStoreNames.contains(name)) {
        store = transaction.objectStore(name);
      } else {
        store = db.createObjectStore(name, options);
      }

      if (index) {
        index.forEach(current => {
          store.createIndex(...current);
        });
      }
    } else {
      db.createObjectStore(collection, {
        keyPath: "id",
        autoIncrement: true
      });
    }
  }

  return openDB(DATABASE_NAME, 7, {
    upgrade: (db, oldVersion, _newVersion, transaction) => {
      if (oldVersion < 1) {
        DB_COLLECTIONS_V1.forEach(collection => createCollections(collection, db));
      }
      if (oldVersion < 2) {
        DB_COLLECTIONS_V2.forEach(collection => createCollections(collection, db));
      }
      if (oldVersion < 3) {
        DB_COLLECTIONS_V3.forEach(collection => createCollections(collection, db));
      }
      if (oldVersion < 4) {
        DB_COLLECTIONS_V4.forEach(collection => createCollections(collection, db));
      }
      if (oldVersion < 5) {
        DB_COLLECTIONS_V5.forEach(collection => createCollections(collection, db));
      }
      if (oldVersion < 6) {
        DB_COLLECTIONS_V6.forEach(collection => createCollections(collection, db, transaction));
      }
      if (oldVersion < 7) {
        DB_COLLECTIONS_V7.forEach(collection => createCollections(collection, db));
      }
    }
  });
}

const DB = {
  async closeDB() {
    (await getDB()).close();
  },

  async clearDB() {
    return DB.asyncForEach(Object.keys(DB_COLLECTIONS_NAMES), async collection => {
      const store = DB_COLLECTIONS_NAMES[collection];
      const tx = (await getDB()).transaction(store, TRANSACTION_MODE.READ_WRITE);

      await tx.objectStore(store).clear();
    });
  },

  async getRecord(store, key) {
    return (await getDB()).get(store, key);
  },

  async getAll(store) {
    return (await getDB()).getAll(store);
  },

  async getAllFromIndex(store, index, key) {
    return (await getDB()).getAllFromIndex(store, index, key);
  },

  async add(store, item) {
    return (await getDB()).add(store, item);
  },

  async delete(store, item) {
    return (await getDB()).delete(store, item);
  },

  async searchIndex(store, term, recordType) {
    const index = (await getDB()).transaction(store).store.index("type");
    const results = [];

    let cursor = await index.openCursor(IDBKeyRange.only(recordType));

    while (cursor) {
      const data = cursor.value;

      const fuzzyResults = fuzzysort.go(term, uniq(data.terms), { threshold: -100 });

      if (fuzzyResults.length) {
        // eslint-disable-next-line no-loop-func
        results.push(...fuzzyResults.flatMap(result => [{ ...result, data }]));
      }
      // eslint-disable-next-line no-await-in-loop
      cursor = await cursor.continue();
    }

    return sortBy(results, ["score"]).map(result => result.data);
  },

  async slice(store, { orderBy, orderDir, offset, limit, recordType }) {
    const results = [];
    let cursor = null;
    const transaction = (await getDB()).transaction(store);
    const cursorType = orderDir === "desc" ? "prev" : "next";

    if (orderBy) {
      const index = transaction.store.index(`type+${orderBy}`);

      cursor = await index.openCursor(IDBKeyRange.bound([recordType], [recordType, []]), cursorType);
    } else {
      cursor = await transaction.store.index("type").openCursor(IDBKeyRange.only(recordType), cursorType);
    }

    if (offset > 0) {
      cursor = await cursor.advance(offset);
    }

    let resultCount = 0;

    while (cursor && resultCount < limit) {
      results.push(cursor.value);
      // eslint-disable-next-line no-await-in-loop
      cursor = await cursor.continue();
      // eslint-disable-next-line no-plusplus
      resultCount++;
    }

    return results;
  },

  async count(store, index, recordType) {
    if (index) {
      return (await getDB()).countFromIndex(store, index, recordType);
    }

    return (await getDB()).count(store);
  },

  async clear(store) {
    return (await getDB()).clear(store);
  },

  async save(isArray = false, args = {}) {
    return isArray ? DB.bulkAdd(args) : DB.put(args);
  },

  async put({ store, data, key = {}, queryIndex, callbacks = {} }) {
    const item = data;

    if (queryIndex) {
      item.type = queryIndex.value;
    }

    const tx = (await getDB()).transaction(store, TRANSACTION_MODE.READ_WRITE);
    const objectStore = tx.objectStore(store);

    try {
      const prev = await objectStore.get(isEmpty(key) ? item.id : key);

      if (prev) {
        let record = recordMerge(prev, item, key);

        if (callbacks.beforeSave) {
          record = callbacks.beforeSave(record, prev);
        }

        await objectStore.put(record);

        await tx.done;

        return record;
      }
      throw new Error("Record is new");
    } catch (e) {
      let record = { ...item, ...key };

      if (callbacks.beforeSave) {
        record = callbacks.beforeSave(record);
      }

      await objectStore.put(record);

      await tx.done;

      return record;
    }
  },

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index += 1) {
      // eslint-disable-next-line no-await-in-loop
      await callback(array[index], index, array);
    }
  },

  async bulkAdd({ store, data, queryIndex, callbacks = {} }) {
    const isDataArray = Array.isArray(data);
    const tx = (await getDB()).transaction(store, TRANSACTION_MODE.READ_WRITE);
    const collection = tx.objectStore(store);
    const records = [];

    await DB.asyncForEach(isDataArray ? data : Object.keys(data), async record => {
      const _record = record;

      if (queryIndex) {
        _record.type = queryIndex.value;
      }

      try {
        const prev = await collection.get(isDataArray ? _record.id : data[_record]?.id);

        if (prev) {
          let item = isDataArray ? recordMerge(prev, _record) : recordMerge(prev, data[_record]);

          records.push(item);

          if (callbacks.beforeSave) {
            item = callbacks.beforeSave(item, prev);
          }

          await collection.put(item);
        } else {
          let item = isDataArray ? _record : data[_record];

          if (callbacks.beforeSave) {
            item = callbacks.beforeSave(item, prev);
          }

          records.push(item);
          await collection.put(item);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(error);
      }
    });

    await tx.done;

    return records;
  },

  async onTransaction(store, mode, callback) {
    const tx = (await getDB()).transaction(store, mode);
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
};

Object.freeze(DB);

export default DB;
