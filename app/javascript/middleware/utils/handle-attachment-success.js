// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import merge from "deepmerge";

import { syncIndexedDB, TRANSACTION_MODE } from "../../db";
import subformAwareMerge from "../../db/utils/subform-aware-merge";

import mergeAttachment from "./merge-attachment";

const handleAttachmentSuccess = async ({ json, db, fromAttachment }) => {
  const { field_name: fieldName } = fromAttachment;

  const recordDB = await syncIndexedDB({ ...db, mode: TRANSACTION_MODE.READ_WRITE }, {}, "", async (tx, store) => {
    const recordData = await store.get(db.id);

    const data = { ...recordData, [fieldName]: [...(recordData[fieldName] || [])] };

    data[fieldName] = mergeAttachment(data[fieldName], json, fromAttachment);

    data.type = db.recordType;

    const merged = merge(recordData, data, { arrayMerge: subformAwareMerge });

    await store.put(merged);

    await tx.done;

    return merged;
  });

  return recordDB;
};

export default handleAttachmentSuccess;
