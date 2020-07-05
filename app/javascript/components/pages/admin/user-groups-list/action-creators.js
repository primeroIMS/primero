/* eslint-disable import/prefer-default-export */

import { RECORD_PATH } from "../../../../config";

import actions from "./actions";

export const fetchUserGroups = params => {
  const { data } = params || {};

  return {
    type: actions.USER_GROUPS,
    api: {
      path: RECORD_PATH.user_groups,
      params: data
    }
  };
};
