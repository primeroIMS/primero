/* eslint-disable import/prefer-default-export */

import { RECORD_PATH } from "../../../../config";

import actions from "./actions";

export const fetchAgencies = params => {
  const { data } = params || {};

  return {
    type: actions.AGENCIES,
    api: {
      path: RECORD_PATH.agencies,
      params: data
    }
  };
};
