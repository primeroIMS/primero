import { syncIndexedDB } from "../../db";

import { deleteFromQueue } from "./queue";
import handleAttachmentSuccess from "./handle-attachment-success";
import isOnline from "./is-online";

async function handleSuccess(store, payload) {
  const { type, json, db, fromQueue, fromAttachment, params } = payload;
  const online = isOnline(store);

  const payloadFromDB = fromAttachment
    ? await handleAttachmentSuccess(payload)
    : await syncIndexedDB({ ...db, online, params }, json);

  await deleteFromQueue(fromQueue);

  store.dispatch({
    type: `${type}_SUCCESS`,
    payload: payloadFromDB
  });
}

export default handleSuccess;
