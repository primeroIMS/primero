/* eslint-disable import/prefer-default-export */

import { ENQUEUE_SNACKBAR, generate } from "../../notifier";

import actions from "./actions";
import { EXPORT_URL } from "./constants";

export const fetchExports = params => {
  const { data } = params || {};

  return {
    type: actions.FETCH_EXPORTS,
    api: {
      path: EXPORT_URL,
      params: data
    }
  };
};

export const deleteExport = id => {
  return {
    type: actions.DELETE_EXPORT,
    api: {
      path: `${EXPORT_URL}/${id}`,
      method: "DELETE",
      successCallback: {
        action: ENQUEUE_SNACKBAR,
        payload: {
          messageKey: "bulk_export.delete.success",
          options: {
            variant: "success",
            key: generate.messageKey()
          }
        }
      }
    }
  };
};
