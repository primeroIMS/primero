import { syncIndexedDB } from "../../db";

import { deleteFromQueue } from "./queue";
import handleAttachmentSuccess from "./handle-attachment-success";

async function handleSuccess(store, payload) {
  const { type, json, db, fromQueue, fromAttachment } = payload;

  const payloadFromDB = fromAttachment ? await handleAttachmentSuccess(payload) : await syncIndexedDB(db, json);

  await deleteFromQueue(fromQueue);

  store.dispatch({
    type: `${type}_SUCCESS`,
    payload: payloadFromDB
  });
}

export default handleSuccess;
