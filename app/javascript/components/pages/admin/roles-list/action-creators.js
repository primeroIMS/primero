import { isImmutable } from "immutable";

import { RECORD_PATH } from "../../../../config";

import actions from "./actions";

export const fetchRoles = params => {
  const { data } = params || {};

  return {
    type: actions.ROLES,
    api: {
      path: RECORD_PATH.roles,
      params: isImmutable(data) ? data.set("managed", true) : { ...data, managed: true }
    }
  };
};

export const setRolesFilter = payload => ({
  type: actions.SET_ROLES_FILTER,
  payload
});
