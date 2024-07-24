// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import merge from "deepmerge";

import { syncIndexedDB, TRANSACTION_MODE } from "../../db";
import subformAwareMerge from "../../db/utils/subform-aware-merge";

const isNewAttachment = (fromAttachment, json) => json?.data?.id && !fromAttachment.id;

const handleAttachmentSuccess = async ({ json, db, fromAttachment }) => {
  const { id, field_name: fieldName, _destroy } = fromAttachment;

  const recordDB = await syncIndexedDB({ ...db, mode: TRANSACTION_MODE.READ_WRITE }, {}, "", async (tx, store) => {
    const recordData = await store.get(db.id);

    const data = { ...recordData, [fieldName]: [...(recordData[fieldName] || [])] };

    data[fieldName] = data[fieldName].map(attachment => ({
      ...attachment,
      ...(json.data.id === attachment.id ? json.data : {}),
      marked_destroy: _destroy && attachment.id === id
    }));

    if (isNewAttachment(fromAttachment, json)) {
      data[fieldName].push(json.data);
    }

    data.type = db.recordType;

    const merged = merge(recordData, data, { arrayMerge: subformAwareMerge });

    await store.put(merged);

    await tx.done;

    return merged;
  });

  return recordDB;
};

export default handleAttachmentSuccess;
