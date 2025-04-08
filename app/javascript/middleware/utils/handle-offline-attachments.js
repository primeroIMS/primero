// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import merge from "deepmerge";
import isEqual from "lodash/isEqual";

import syncIndexedDB from "../../db/sync";
import { getAttachmentFields } from "../../components/record-form";

import keepExistingMerge from "./keep-existing-merge";

export const buildDBPayload = async (_store, action) => {
  const { db, id, body } = action.api;
  const handledBody = { data: { ...body.data } };

  if (id) {
    const recordDB = await syncIndexedDB({ ...db, id }, {}, "find");

    return merge(recordDB, handledBody, { arrayMerge: keepExistingMerge });
  }

  return body;
};

export const skipSyncedAttachments = async (store, action) => {
  const { db, id, body } = action.api;
  const payload = { ...action, api: { ...action.api, body: { ...body, data: { ...body.data } } } };

  if (id) {
    const attachmentFields = getAttachmentFields(store.getState()).toSet();
    const recordDB = await syncIndexedDB({ ...db, id }, {}, "find");

    attachmentFields.forEach(field => {
      const dbAttachments = recordDB.data[field] || [];
      const bodyAttachments = payload.api.body.data[field] || [];

      if (bodyAttachments.length) {
        payload.api.body.data[field] = bodyAttachments.filter(
          elem =>
            !dbAttachments.some(
              dbElem =>
                (dbElem.id ? dbElem.id === elem.id : dbElem.attachment === elem.attachment) &&
                isEqual(elem.date, dbElem.date) &&
                isEqual(elem.description, dbElem.description) &&
                isEqual(elem.comments, dbElem.comments)
            )
        );
      }
    });
  }

  return payload;
};
