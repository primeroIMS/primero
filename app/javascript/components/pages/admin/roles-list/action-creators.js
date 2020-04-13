/* eslint-disable import/prefer-default-export */

import { RECORD_PATH } from "../../../../config";

import actions from "./actions";

export const fetchRoles = data => {
  const { options } = data || {};

  return {
    type: actions.ROLES,
    api: {
      path: RECORD_PATH.roles,
      params: options
    }
  };
};
