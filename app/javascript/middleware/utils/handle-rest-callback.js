import { push } from "connected-react-router";

const handleRestCallback = (store, callback, response, json, fromQueue = false) => {
  if (callback && !fromQueue) {
    if (Array.isArray(callback)) {
      callback.forEach(cb => handleRestCallback(store, cb, response, json, fromQueue));
    } else {
      const isObjectCallback = typeof callback === "object";
      const isApiCallback = isObjectCallback && "api" in callback;

      const successPayload = isObjectCallback
        ? {
            type: callback.action,
            payload: callback.payload
          }
        : {
            type: callback,
            payload: { response, json }
          };

      store.dispatch(isApiCallback ? { type: callback.action, api: callback.api } : successPayload);

      if (isObjectCallback && callback.redirect && !fromQueue) {
        let { redirect } = callback;

        if (callback.redirectWithIdFromResponse) {
          redirect = `${callback.redirect}/${json?.data?.id}`;
        }
        if (callback.redirectToEdit) {
          redirect = `${callback.redirect}/${json?.data?.id}/edit`;
        }
        if (callback.incidentPath) {
          redirect = callback.incidentPath === "new" ? `/incidents/${callback.moduleID}/new` : callback.incidentPath;
        }

        store.dispatch(push(redirect));
      }
    }
  }
};

export default handleRestCallback;
