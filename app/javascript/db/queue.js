import { DB_STORES } from "./constants";

import DB from ".";

const queueIndexedDB = {
  getAll: () => {
    return DB.getAll(DB_STORES.OFFLINE_REQUESTS);
  },

  add: action => {
    DB.add(DB_STORES.OFFLINE_REQUESTS, action);
  },

  delete: index => {
    DB.delete(DB_STORES.OFFLINE_REQUESTS, index);
  }
};

export default queueIndexedDB;
