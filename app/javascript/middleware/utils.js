import { push } from "connected-react-router";
import uuid from "uuid/v4";

const generateName = (body = {}) => {
  const { name_first: nameFirst, name_last: nameLast, name } = body;

  if (name) {
    return { name };
  }

  return nameFirst || nameLast ? { name: `${nameFirst} ${nameLast}` } : {};
};

export const handleSuccessCallback = (
  store,
  successCallback,
  response,
  json,
  fromQueue = false
) => {
  if (successCallback) {
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
