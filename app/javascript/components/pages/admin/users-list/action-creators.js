// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { METHODS, RECORD_PATH } from "../../../../config";
import { CLEAR_DIALOG } from "../../../action-dialog";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";

import actions from "./actions";

export const fetchUsers = (params, asCallback = false) => {
  const { data } = params || {};

  return {
    [asCallback ? "action" : "type"]: actions.USERS,
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

export const disableUsers = ({ filters, currentFilters, message }) => ({
  type: actions.DISABLE_USERS,
  api: {
    method: METHODS.POST,
    path: `${RECORD_PATH.users}/update_bulk`,
    body: { data: filters.toJS() },
    successCallback: [
      fetchUsers({ data: currentFilters }, true),
      { action: CLEAR_DIALOG },
      {
        action: ENQUEUE_SNACKBAR,
        payload: {
          message,
          options: {
            variant: "success",
            key: generate.messageKey(message)
          }
        }
      }
    ]
  }
});
