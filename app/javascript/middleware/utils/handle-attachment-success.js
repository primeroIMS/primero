import merge from "deepmerge";

import { syncIndexedDB, TRANSACTION_MODE } from "../../db";
import subformAwareMerge from "../../db/utils/subform-aware-merge";

const handleAttachmentSuccess = async ({ json, db, fromAttachment }) => {
  const { id, field_name: fieldName } = fromAttachment;

  const recordDB = await syncIndexedDB({ ...db, mode: TRANSACTION_MODE.READ_WRITE }, {}, "", async (tx, store) => {
    const recordData = await store.get(db.id);

    const data = { ...recordData, [fieldName]: [...(recordData[fieldName] || [])] };

    data[fieldName] = data[fieldName].map(attachment => ({
      ...attachment,
      marked_destroy: id
        ? attachment.id === id
        : attachment.field_name === json.data.field_name &&
          attachment.file_name === json.data.file_name &&
          !attachment.id &&
          json.data.id
    }));

    if (json.data && json.data.id && !fromAttachment.id) {
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
