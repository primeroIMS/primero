import uuid from "uuid";

import { syncIndexedDB, queueIndexedDB } from "../../db";
import { getAttachmentFields } from "../../components/record-form";

import withGeneratedProperties from "./with-generated-properties";
import offlineDispatchSuccess from "./offline-dispatch-success";

const handleOfflineAttachments = async (store, action) => {
  const { db, id, body } = action.api;
  const handledBody = { data: { ...body.data } };

  const attachmentFields = getAttachmentFields(store.getState()).toSet();
  const recordDB = await syncIndexedDB({ ...db, id }, {}, "find");

  attachmentFields.forEach(field => {
    if (handledBody.data[field]) {
      const attachments = body.data[field].reduce(
        (acc, elem) => {
          if (elem._destroy) {
            acc.destroyed.push(elem._destroy);
          } else {
            acc.added.push(elem);
          }

          return acc;
        },
        { destroyed: [], added: [] }
      );

      handledBody.data[field] = recordDB.data[field]
        .map(attachment => ({
          ...attachment,
          marked_destroy: attachments.destroyed.includes(attachment.id)
        }))
        .concat(attachments.added);
    }
  });

  return handledBody;
};

export default async (store, action) => {
  const { api, type } = action;
  const touchedAction = withGeneratedProperties(action, store);

  await queueIndexedDB.add({ ...touchedAction, fromQueue: uuid.v4() });

  try {
    const handledBody = await handleOfflineAttachments(store, touchedAction);

    const payloadFromDB = await syncIndexedDB(api?.db, handledBody);

    offlineDispatchSuccess(store, action, payloadFromDB);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error, type);
  }
};
