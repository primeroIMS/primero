import uuid from "uuid";

import { syncIndexedDB, queueIndexedDB } from "../../db";

import withResponseParams from "./with-response-params";
import withGeneratedProperties from "./with-generated-properties";
import offlineDispatchSuccess from "./offline-dispatch-success";
import { skipSyncedAttachments, buildDBPayload } from "./handle-offline-attachments";

export default async (store, action) => {
  const { api, type } = action;
  const touchedAction = await skipSyncedAttachments(store, withGeneratedProperties(action, store));

  await queueIndexedDB.add({ ...touchedAction, fromQueue: uuid.v4() });

  try {
    const dbPayload = await buildDBPayload(store, withResponseParams(touchedAction));

    const payloadFromDB = await syncIndexedDB(api?.db, dbPayload);

    offlineDispatchSuccess(store, action, payloadFromDB);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error, type);
  }
};
