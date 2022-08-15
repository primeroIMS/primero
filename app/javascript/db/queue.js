import EventManager from "../libs/messenger";
import { QUEUE_ADD, QUEUE_FINISHED } from "../libs/queue/constants";

import { DB_STORES } from "./constants";
import DB from "./db";

const queueIndexedDB = {
  getAll: () => {
    return DB.getAll(DB_STORES.OFFLINE_REQUESTS);
  },

  add: async action => {
    await Promise.allSettled([].concat(action).map(current => DB.add(DB_STORES.OFFLINE_REQUESTS, current)));
    EventManager.publish(QUEUE_ADD, action);
  },

  failed: async index => {
    const request = await DB.getRecord(DB_STORES.OFFLINE_REQUESTS, index);

    return DB.put({
      store: DB_STORES.OFFLINE_REQUESTS,
      data: { ...request, tries: (request.tries || 0) + 1, last_attempt: new Date() },
      key: { fromQueue: index }
    });
  },

  delete: async index => {
    await DB.delete(DB_STORES.OFFLINE_REQUESTS, index);
    EventManager.publish(QUEUE_FINISHED, index);
  }
};

export default queueIndexedDB;
