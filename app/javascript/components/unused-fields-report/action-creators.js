// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import { METHODS } from "../../config";
import { ENQUEUE_SNACKBAR } from "../notifier";

import actions from "./actions";

/* eslint-disable import/prefer-default-export */
const UNUSED_FIELDS_REPORT_PATH = "/unused_fields_report/current";

export const fetchUnusedFieldsReport = () => ({
  type: actions.FETCH_UNUSED_FIELDS,
  api: {
    path: UNUSED_FIELDS_REPORT_PATH,
    method: METHODS.GET,
    failureCallback: [
      {
        action: ENQUEUE_SNACKBAR,
        dispatchIfStatus: 404,
        payload: {
          messageKey: "unused_fields_report.not_found_error",
          options: {
            variant: "error",
            key: "unused_fields_report.not_found_error"
          }
        },
        redirectWithIdFromResponse: false,
        redirect: false
      }
    ]
  }
});
