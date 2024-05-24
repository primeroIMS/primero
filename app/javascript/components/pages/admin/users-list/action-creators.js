// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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
