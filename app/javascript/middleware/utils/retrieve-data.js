import { syncIndexedDB, METHODS } from "../../db";

import offlineDispatchSuccess from "./offline-dispatch-success";

export default async (store, action = {}) => {
  const { db, type } = action;

  try {
    const payloadFromDB = await syncIndexedDB(db, action, METHODS.READ);

    offlineDispatchSuccess(store, action, payloadFromDB);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error, type);
  }
};
