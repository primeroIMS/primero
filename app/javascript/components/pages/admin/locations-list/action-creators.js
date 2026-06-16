import { fromJS, isImmutable } from "immutable";

import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import { METHODS, RECORD_PATH } from "../../../../config";
import { CLEAR_DIALOG } from "../../../action-dialog";

import actions from "./actions";

export const fetchLocations = (params, asCallback = false) => {
  const data = isImmutable(params) ? params : fromJS(params?.data || {});

  return {
    [asCallback ? "action" : "type"]: actions.LOCATIONS,
    api: {
      path: RECORD_PATH.locations,
      params: data.set("hierarchy", true)
    }
  };
};

export const disableLocations = (ids, params, message, disabled = true) => ({
  type: actions.DISABLE_LOCATIONS,
  api: {
    method: METHODS.POST,
    path: `${RECORD_PATH.locations}/update_bulk`,
    body: { data: ids.map(id => ({ id, disabled })) },
    successCallback: [
      fetchLocations(params, true),
      { action: CLEAR_DIALOG },
      {
        action: ENQUEUE_SNACKBAR,
        payload: {
          message,
          options: {
            variant: "success",
            key: generate.messageKey(message)
          }
        }
      }
    ]
  }
});

export const setLocationsFilter = payload => ({
  type: actions.SET_LOCATIONS_FILTER,
  payload
});
