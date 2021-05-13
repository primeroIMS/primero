import isEqual from "date-fns/isEqual";
import merge from "deepmerge";

import { syncIndexedDB } from "../../db";
import { getAttachmentFields } from "../../components/record-form";

import keepExistingMerge from "./keep-existing-merge";

export const buildDBPayload = async (store, action) => {
  const { db, id, body } = action.api;
  const handledBody = { data: { ...body.data } };
  const recordDB = await syncIndexedDB({ ...db, id }, {}, "find");

  return merge(recordDB, handledBody, { arrayMerge: keepExistingMerge });
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
