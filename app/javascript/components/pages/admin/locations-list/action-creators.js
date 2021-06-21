import { fromJS, isImmutable } from "immutable";

import { RECORD_PATH } from "../../../../config";

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

export const setLocationsFilter = payload => ({
  type: actions.SET_LOCATIONS_FILTER,
  payload
});
