// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { ENQUEUE_SNACKBAR, SNACKBAR_VARIANTS } from "../../components/notifier";
import { getShortIdFromUniqueId } from "../../components/records/utils";
import { SET_DIALOG_PENDING } from "../../components/action-dialog";

import handleRestCallback from "./handle-rest-callback";

function getMessageKey(isAttachmentError, fromQueue, jsonErrors, id) {
  if (isAttachmentError) return "sync.error.attachment";
  if (fromQueue) return `sync.error.${id ? "update" : "create"}`;

  return jsonErrors?.map(err => err.message).at(0) || "errors.api.internal_server";
}

function getMessageParams(isAttachmentError, fromAttachment, fromQueue, id) {
  if (isAttachmentError && fromAttachment?.field_name) {
    return { record_type: fromAttachment?.record_type };
  }
  if (fromQueue && id) {
    return { short_id: getShortIdFromUniqueId(id) };
  }

  return null;
}

function getErrorKey(isAttachmentError, fromQueue, fromAttachmentRecordId, id) {
  if (isAttachmentError) return `attachment_sync_error_${fromAttachmentRecordId || id || "create"}`;
  if (fromQueue) return `record_sync_error_${id || "create"}`;

  return "internal_server";
}

export default ({
  store,
  response = {},
  json = {},
  recordType = null,
  fromQueue = false,
  id = null,
  error,
  fromAttachment = null
}) => {
  const isAttachmentError = !!(fromQueue && fromAttachment);
  const jsonErrors = json?.errors || null;
  const messageParams = getMessageParams(isAttachmentError, fromAttachment, fromQueue, id);

  const errorPayload = [
    {
      action: ENQUEUE_SNACKBAR,
      payload: {
        messageKey: getMessageKey(isAttachmentError, fromQueue, jsonErrors, id),
        messageDetailed: response?.message || error?.message,
        ...(messageParams && Object.keys(messageParams).length ? { messageParams } : {}),
        ...(recordType ? { recordType } : {}),
        options: {
          variant: SNACKBAR_VARIANTS.error,
          key: getErrorKey(isAttachmentError, fromQueue, fromAttachment?.record?.id, id)
        }
      }
    },
    {
      action: SET_DIALOG_PENDING,
      payload: false
    }
  ];

  if (response.status !== 401) {
    handleRestCallback(store, errorPayload, response, json);
  }
};
