import { syncIndexedDB, METHODS } from "../../db";

import offlineDispatchStart from "./offline-dispatch-start";
import offlineDispatchSuccess from "./offline-dispatch-success";

export default async (store, action = {}) => {
  const { api, type } = action;

  try {
    console.log("===offlineDispatchStart===");
    offlineDispatchStart(store, action);

    const payloadFromDB = await syncIndexedDB(api?.db, action, METHODS.READ);

    offlineDispatchSuccess(store, action, payloadFromDB);
    console.log("===offlineDispatchSuccess===");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error, type);
  }
};
