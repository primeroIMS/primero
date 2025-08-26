// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { METHODS } from "../../config";
import { ENQUEUE_SNACKBAR, generate } from "../notifier";

import actions from "./actions";

export const fetchFlags = (recordType, record) => async dispatch => {
  dispatch({
    type: actions.FETCH_FLAGS,
    api: {
      path: `${recordType}/${record}/flags`
    }
  });
};

export const unFlag = (id, body, message, recordType, record) => {
  return {
    type: actions.UNFLAG,
    api: {
      path: `${recordType}/${record}/flags/${id}`,
      method: "PATCH",
      body,
      successCallback: {
        action: ENQUEUE_SNACKBAR,
        payload: {
          message,
          options: {
            variant: "success",
            key: generate.messageKey()
          }
        }
      }
    }
  };
};

export const addFlag = (body, message, path) => ({
  type: actions.ADD_FLAG,
  api: {
    path,
    method: "POST",
    body,
    successCallback: {
      action: ENQUEUE_SNACKBAR,
      payload: {
        message,
        options: {
          variant: "success",
          key: generate.messageKey()
        }
      }
    }
  }
});

export const updateFlag = ({ recordType, recordId, flagId, body }) => ({
  type: actions.UPDATE_FLAG,
  api: {
    path: `${recordType}/${recordId}/flags/${flagId}`,
    method: METHODS.PATCH,
    body,
    successCallback: {
      action: ENQUEUE_SNACKBAR,
      payload: {
        messageKey: "flags.flag_updated",
        options: {
          variant: "success",
          key: generate.messageKey()
        }
      }
    }
  }
});

export const setSelectedFlag = id => ({
  type: actions.SET_SELECTED_FLAG,
  payload: { id }
});
