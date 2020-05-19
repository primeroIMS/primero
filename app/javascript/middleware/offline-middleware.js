import uuid from "uuid/v4";

import { syncIndexedDB, queueIndexedDB, METHODS } from "../db";
import { DB_STORES } from "../db/constants";

import {
  handleRestCallback,
  generateRecordProperties,
  isOnline
} from "./utils";

const withGeneratedProperties = (action, store, db) => {
  const { api } = action;
  const { recordType, collection } = db;
  const isRecord = collection === DB_STORES.RECORDS;

  const generatedProperties = generateRecordProperties(
    store,
    api,
    recordType,
    isRecord,
    api?.isSubform
  );

  return {
    ...action,
    api: {
      ...api,
      body: { data: { ...api?.body?.data, ...generatedProperties } }
    }
  };
};

const dispatchSuccess = (store, action, payload) => {
  const { type, api, fromQueue } = action;
  const data = {
    ...payload?.data,
    ...(api?.responseExtraParams && { ...api?.responseExtraParams })
  };

  store.dispatch({
    type: `${type}_SUCCESS`,
    payload: api?.responseRecordKey
      ? {
          data: {
            record: {
              id: api?.responseRecordID,
              [api?.responseRecordKey]: api?.responseRecordArray ? [data] : data
            }
          }
        }
      : payload
  });

  handleRestCallback(store, api?.successCallback, null, payload, fromQueue);

  store.dispatch({
    type: `${type}_FINISHED`,
    payload: true
  });
};

const retreiveData = async ({ store, db, action, type }) => {
  try {
    const payloadFromDB = await syncIndexedDB(db, action, METHODS.READ);

    dispatchSuccess(store, action, payloadFromDB);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error, type);
  }
};

const queueData = async ({ store, db, action, type }) => {
  const touchedAction = withGeneratedProperties(action, store, db);

  await queueIndexedDB.add({ ...touchedAction, fromQueue: uuid() });

  try {
    const payloadFromDB = await syncIndexedDB(db, touchedAction?.api?.body);

    dispatchSuccess(store, action, payloadFromDB);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error, type);
  }
};

const offlineMiddleware = store => next => action => {
  if (!action?.api?.path || isOnline(store)) {
    return next(action);
  }

  const {
    type,
    api: { method, db, queueOffline },
    fromQueue
  } = action;
  const dataArgs = { store, db, action, type };
  const apiMethod = method || "GET";

  if (apiMethod === "GET") {
    retreiveData(dataArgs);

    return next(action);
  }

  if (queueOffline && !fromQueue) {
    queueData(dataArgs);
  }

  return next(action);
};

export default offlineMiddleware;
