import { isImmutable } from "immutable";

import { RECORD_PATH } from "../../../../config";

import actions from "./actions";

export const fetchUserGroups = params => {
  const { data } = params || {};

  return {
    type: actions.USER_GROUPS,
    api: {
      path: RECORD_PATH.user_groups,
      params: isImmutable(data) ? data.set("managed", true) : { ...data, managed: true }
    }
  };
};

export const setUserGroupsFilter = payload => ({
  type: actions.SET_USER_GROUPS_FILTER,
  payload
});
