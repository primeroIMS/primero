import uuid from "uuid";

import { syncIndexedDB, queueIndexedDB } from "../../db";

import withGeneratedProperties from "./with-generated-properties";
import offlineDispatchSuccess from "./offline-dispatch-success";

export default async (store, action) => {
  const { api, type } = action;
  const touchedAction = withGeneratedProperties(action, store, db);

  await queueIndexedDB.add({ ...touchedAction, fromQueue: uuid.v4() });

  try {
    const payloadFromDB = await syncIndexedDB(
      api?.db,
      touchedAction?.api?.body
    );

    offlineDispatchSuccess(store, action, payloadFromDB);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error, type);
  }
};
