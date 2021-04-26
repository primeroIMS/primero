/* eslint-disable import/prefer-default-export */

import { RECORD_PATH, ROUTES } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";

import actions from "./actions";

export const fetchCodeOfConduct = () => ({
  type: actions.FETCH_CODE_OF_CONDUCT,
  api: {
    path: RECORD_PATH.codes_of_conduct,
    method: "GET"
  }
});

export const saveCodeOfConduct = ({ body, message }) => ({
  type: actions.SAVE_CODE_OF_CONDUCT,
  api: {
    path: RECORD_PATH.codes_of_conduct,
    method: "POST",
    body,
    successCallback: {
      action: ENQUEUE_SNACKBAR,
      payload: {
        message,
        options: {
          variant: "success",
          key: generate.messageKey(message)
        }
      },
      redirectWithIdFromResponse: false,
      redirect: ROUTES.admin_code_of_conduct
    }
  }
});
