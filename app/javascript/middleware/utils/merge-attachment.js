// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

const isNewAttachment = (fromAttachment, json) => json?.data?.id && !fromAttachment.id;

const isAttachmentUpdate = (attachment, json) => json.data.id === attachment.id;

const isOfflineAttachmentUpdate = (attachment, json) =>
  attachment.field_name === json.data.field_name &&
  attachment.file_name === json.data.file_name &&
  attachment.description === json.data.description &&
  attachment.date === json.data.date &&
  attachment.comments === json.data.comments &&
  !attachment.id &&
  json.data.id;

export default (attachments, json, fromAttachment) => {
  const { id, _destroy } = fromAttachment;

  const merged = attachments.map(elem => {
    if (isOfflineAttachmentUpdate(elem, json)) {
      return json.data;
    }

    if (isAttachmentUpdate(elem, json)) {
      return { ...elem, ...json.data, marked_destroy: _destroy && json.data.id === id };
    }

    return elem;
  });

  const isAlreadyMerged = merged.some(elem => elem.id === json.data.id);

  if (isNewAttachment(fromAttachment, json) && !isAlreadyMerged) {
    merged.push(json.data);
  }

  return merged;
};
