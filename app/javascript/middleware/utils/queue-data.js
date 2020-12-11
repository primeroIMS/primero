import uuid from "uuid";

import { syncIndexedDB, queueIndexedDB } from "../../db";
import { getAttachmentFields } from "../../components/record-form";

import withGeneratedProperties from "./with-generated-properties";
import offlineDispatchSuccess from "./offline-dispatch-success";

const handleOfflineAttachments = async (store, action) => {
  const reaction = { ...action };
  const attachmentFields = getAttachmentFields(store.getState()).toSet();
  const recordDB = await syncIndexedDB({ ...reaction.api.db, id: reaction.api.id }, {}, "find");

  attachmentFields.forEach(field => {
    if (reaction.api.body.data[field]) {
      const attachments = reaction.api.body.data[field].reduce(
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

      reaction.api.body.data[field] = recordDB.data[field]
        .map(attachment => ({
          ...attachment,
          _destroy: attachments.destroyed.includes(attachment.id)
        }))
        .concat(attachments.added);
    }
  });

  return reaction.api.body;
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
