import { push } from "connected-react-router";
import uuid from "uuid/v4";

import { queueIndexedDB } from "../db";
import { METHODS } from "../config";
import { ENQUEUE_SNACKBAR, generate, SNACKBAR_VARIANTS } from "../components/notifier";
import { SET_DIALOG_PENDING } from "../components/record-actions/actions";

const generateName = (body = {}) => {
  const { name_first: nameFirst, name_last: nameLast, name } = body;

  if (name) {
    return { name };
  }

  return nameFirst || nameLast ? { name: `${nameFirst} ${nameLast}` } : {};
};

export const handleRestCallback = (
  store,
  successCallback,
  response,
  json,
  fromQueue = false
) => {
  if (successCallback) {
    if (Array.isArray(successCallback)) {
      successCallback.forEach(callback =>
        handleRestCallback(store, callback, response, json, fromQueue)
      );
    } else {
      const isCallbackObject = typeof successCallback === "object";
      const successPayload = isCallbackObject
        ? {
            type: successCallback.action,
            payload: successCallback.payload
          }
        : {
            type: successCallback,
            payload: { response, json }
          };

      store.dispatch(successPayload);

      if (isCallbackObject && successCallback.redirect && !fromQueue) {
        store.dispatch(
          push(
            successCallback.redirectWithIdFromResponse
              ? `${successCallback.redirect}/${json?.data?.id}`
              : successCallback.redirect
          )
        );
      }
    }
  }
};

export const defaultErrorCallback = (store, response, json) => {
  const messages = json?.errors?.map(error => error.message).join(", ");
  const errorPayload = [
    {
      action: ENQUEUE_SNACKBAR,
      payload: {
        messageKey: messages || "errors.api.internal_server",
        options: {
          variant: SNACKBAR_VARIANTS.error,
          key: generate.messageKey()
        }
      }
    },
    {
      action: SET_DIALOG_PENDING,
      payload: {
        pending: false
      }
    }
  ];

  if (response.status !== 401) {
    handleRestCallback(store, errorPayload, response, json);
  }
};

export const isOnline = store => {
  return store.getState().getIn(["application", "online"], false);
};

export const generateRecordProperties = (store, api, recordType, isRecord) => {
  const username = store.getState().getIn(["user", "username"], "false");
  const id = uuid();
  const shortID = id.substr(id.length - 7);

  return {
    ...(!api?.body?.id && { id, short_id: shortID, case_id_display: shortID }),
    // eslint-disable-next-line camelcase
    ...(!api?.body?.owned_by && isRecord && { owned_by: username }),
    ...(!api?.body?.type && isRecord && { type: recordType }),
    // eslint-disable-next-line camelcase
    ...(!api?.body?.created_at && isRecord && { created_at: new Date() }),
    ...(isRecord && generateName(api?.body))
  };
};

export const partitionObject = (obj, filterFn) =>
  Object.keys(obj).reduce(
    (result, key) =>
      filterFn(obj[key], key)
        ? [{ ...result[0], [key]: obj[key] }, result[1]]
        : [result[0], { ...result[1], [key]: obj[key] }],
    [{}, {}]
  );

export const processAttachments = ({ attachments, id, recordType }) => {
  const actions = Object.keys(attachments).reduce((prev, current) => {
    attachments[current].forEach(attachment => {
      const method = attachment?._destroy ? METHODS.DELETE : METHODS.POST;
      const isDelete = method === "DELETE";

      const path = `${recordType}/${id}/attachments${
        isDelete ? `/${attachment?._destroy}` : ""
      }`;

      const action = isDelete ? "DELETE_ATTACHMENT" : "SAVE_ATTACHMENT";

      // eslint-disable-next-line camelcase
      if (!attachment?.attachment_url) {
        prev.push({
          type: `${recordType}/${action}`,
          api: {
            path,
            method,
            ...(!isDelete && {
              body: { data: { ...attachment, field_name: current } }
            })
          },
          fromQueue: uuid()
        });
      }
    });

    return prev;
  }, []);

  if (actions) {
    actions.forEach(action => queueIndexedDB.add(action));
  }
};
