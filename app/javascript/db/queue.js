import EventManager from "../libs/messenger";
import { QUEUE_ADD, QUEUE_FINISHED } from "../libs/queue";

import { DB_STORES } from "./constants";
import DB from "./db";

const queueIndexedDB = {
  getAll: () => {
    return DB.getAll(DB_STORES.OFFLINE_REQUESTS);
  },

  add: action => {
    [].concat(action).forEach(current => DB.add(DB_STORES.OFFLINE_REQUESTS, current));
    EventManager.publish(QUEUE_ADD, action);
  },

  delete: async index => {
    await DB.delete(DB_STORES.OFFLINE_REQUESTS, index);
    EventManager.publish(QUEUE_FINISHED, index);
  }
};

export default queueIndexedDB;
