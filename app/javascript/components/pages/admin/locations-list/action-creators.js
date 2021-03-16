/* eslint-disable import/prefer-default-export */

import { fromJS, isImmutable } from "immutable";

import { RECORD_PATH } from "../../../../config";

import actions from "./actions";

export const fetchLocations = params => {
  const data = isImmutable(params) ? params : fromJS(params?.data || {});

  return {
    type: actions.LOCATIONS,
    api: {
      path: RECORD_PATH.locations,
      params: data.set("hierarchy", true)
    }
  };
};
