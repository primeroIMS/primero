// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { DB_COLLECTIONS_NAMES, queueIndexedDB } from "../../db";
import { METHODS } from "../../config";
import uuid from "../../libs/uuid";

const getAttachmentMethod = attachment => {
  if (attachment?._destroy) {
    return METHODS.DELETE;
  }

  return attachment?.id ? METHODS.PATCH : METHODS.POST;
};

function processAttachment({ attachment, current, id, recordType }) {
  const method = getAttachmentMethod(attachment);
  const isDelete = method === METHODS.DELETE;
  const path = `${recordType}/${id}/attachments${METHODS.POST === method ? "" : `/${attachment?.id}`}`;
  const action = isDelete ? "DELETE_ATTACHMENT" : "SAVE_ATTACHMENT";

  // eslint-disable-next-line camelcase
  if (!attachment?.attachment_url) {
    return {
      type: `${recordType}/${action}`,
      api: {
        path,
        method,
        ...(!isDelete && { body: { data: { ...attachment } } }),
        db: { id, collection: DB_COLLECTIONS_NAMES.RECORDS, recordType }
      },
      fromQueue: uuid.v4(),
      tries: 0,
      fromAttachment: {
        ...(attachment?.id ? { id: attachment.id } : {}),
        ...(attachment?._destroy ? { _destroy: attachment._destroy } : {}),
        field_name: current,
        record_type: recordType,
        record: { id }
      }
    };
  }

  return undefined;
}

export default async ({ attachments, id, recordType }) => {
  const actions = Object.keys(attachments).reduce((prev, current) => {
    const attachmentObj = attachments[current];

    if (Array.isArray(attachmentObj)) {
      attachmentObj.forEach(attachment => {
        prev.push(processAttachment({ attachment, current, id, recordType, prev }));
      });
    } else {
      prev.push(processAttachment({ attachment: attachmentObj, current, id, recordType, prev }));
    }

    return prev;
  }, []);

  if (actions) {
    await queueIndexedDB.add(actions.filter(action => action));
  }
};
