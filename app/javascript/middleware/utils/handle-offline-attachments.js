import isEqual from "date-fns/isEqual";

import { syncIndexedDB } from "../../db";
import { getAttachmentFields } from "../../components/record-form";

export const buildDBPayload = async (store, action) => {
  const { db, id, body } = action.api;
  const handledBody = { data: { ...body.data } };

  const attachmentFields = getAttachmentFields(store.getState()).toSet();
  const recordDB = await syncIndexedDB({ ...db, id }, {}, "find");

  attachmentFields.forEach(field => {
    const dbAttachments = recordDB.data[field] || [];
    const bodyAttachments = handledBody.data[field] || [];

    if (bodyAttachments.length) {
      handledBody.data[field] = dbAttachments.concat(bodyAttachments);
    }
  });

  return handledBody;
};

export const skipSyncedAttachments = async (store, action) => {
  const { db, id, body } = action.api;
  const payload = { ...action, api: { ...action.api, body: { ...body, data: { ...body.data } } } };

  const attachmentFields = getAttachmentFields(store.getState()).toSet();
  const recordDB = await syncIndexedDB({ ...db, id }, {}, "find");

  attachmentFields.forEach(field => {
    const dbAttachments = recordDB.data[field] || [];
    const bodyAttachments = payload.api.body.data[field] || [];

    if (bodyAttachments.length) {
      payload.api.body.data[field] = bodyAttachments.filter(
        elem =>
          !dbAttachments.some(dbElem =>
            dbElem.id ? dbElem.id === elem.id : dbElem.attachment === elem.attachment && isEqual(elem.date, dbElem.date)
          )
      );
    }
  });

  return payload;
};
