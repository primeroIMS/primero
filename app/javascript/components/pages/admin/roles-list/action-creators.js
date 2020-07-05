/* eslint-disable import/prefer-default-export */

import { RECORD_PATH } from "../../../../config";

import actions from "./actions";

export const fetchRoles = params => {
  const { data } = params || {};

  return {
    type: actions.ROLES,
    api: {
      path: RECORD_PATH.roles,
      params: data
    }
  };
};
