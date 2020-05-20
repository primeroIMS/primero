import { push } from "connected-react-router";

const handleRestCallback = (
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
        let { redirect } = successCallback;

        if (successCallback.redirectWithIdFromResponse) {
          redirect = `${successCallback.redirect}/${json?.data?.id}`;
        }
        if (successCallback.redirectToEdit) {
          redirect = `${successCallback.redirect}/${json?.data?.id}/edit`;
        }
        store.dispatch(push(redirect));
      }
    }
  }
};

export default handleRestCallback;
