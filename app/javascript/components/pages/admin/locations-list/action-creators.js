/* eslint-disable import/prefer-default-export */

import { RECORD_PATH } from "../../../../config";

import actions from "./actions";

export const fetchLocations = params => {
  const { data } = params || {};

  return {
    type: actions.LOCATIONS,
    api: {
      path: RECORD_PATH.locations,
      params: { ...data, hierarchy: true }
    }
  };
};
