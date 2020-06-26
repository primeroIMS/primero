import { RECORD_PATH } from "../../../../config";

import actions from "./actions";

export const fetchUsers = params => {
  const { data } = params || {};

  return {
    type: actions.USERS,
    api: {
      path: RECORD_PATH.users,
      params: data
    }
  };
};

export const setUsersFilters = payload => ({
  type: actions.SET_USERS_FILTER,
  payload
});
