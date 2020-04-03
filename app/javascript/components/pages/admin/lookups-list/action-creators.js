/* eslint-disable import/prefer-default-export */

import { RECORD_PATH } from "../../../../config";

import actions from "./actions";

export const fetchAdminLookups = params => {
  const { data } = params || {};

  return {
    type: actions.FETCH_LOOKUPS,
    api: {
      path: RECORD_PATH.lookups,
      params: data
    }
  };
};
