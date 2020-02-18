import { DB_STORES } from "./constants";
import DB from "./db";

const queueIndexedDB = {
  getAll: () => {
    return DB.getAll(DB_STORES.OFFLINE_REQUESTS);
  },

  add: action => {
    DB[Array.isArray(action) ? "bulkAdd" : "add"](
      DB_STORES.OFFLINE_REQUESTS,
      action
    );
  },

  delete: index => {
    DB.delete(DB_STORES.OFFLINE_REQUESTS, index);
  }
};

export default queueIndexedDB;
