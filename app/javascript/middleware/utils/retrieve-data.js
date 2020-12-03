import { syncIndexedDB, METHODS } from "../../db";

import offlineDispatchSuccess from "./offline-dispatch-success";

export default async (store, action = {}) => {
  const { api, type } = action;

  try {
    const payloadFromDB = await syncIndexedDB(api?.db, action, METHODS.READ);

    offlineDispatchSuccess(store, action, payloadFromDB);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error, type);
  }
};
