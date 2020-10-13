import { push } from "connected-react-router";

const handleRestCallback = (store, successCallback, response, json, fromQueue = false) => {
  if (successCallback) {
    if (Array.isArray(successCallback)) {
      successCallback.forEach(callback => handleRestCallback(store, callback, response, json, fromQueue));
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
        console.log("######## ", successCallback.redirect, successCallback.incidentPath);
        let { redirect } = successCallback;
        // let state = {};

        if (successCallback.redirectWithIdFromResponse) {
          redirect = `${successCallback.redirect}/${json?.data?.id}`;
        }
        if (successCallback.incidentPath) {
          const caseID = json?.data?.id;

          redirect =
            successCallback.incidentPath === "new"
              ? `/incidents/${successCallback.moduleID}/new`
              : successCallback.incidentPath;
          // state = { caseID: json?.data?.id, redirectToIncident: true };
        }

        store.dispatch(push(redirect));
      }
    }
  }
};

export default handleRestCallback;
