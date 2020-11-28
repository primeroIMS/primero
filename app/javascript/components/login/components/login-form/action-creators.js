/* eslint-disable import/prefer-default-export */

import { QUEUE_READY } from "../../../../libs/queue";
import connectivityActions from "../../../connectivity/actions";

import actions from "./actions";

export const attemptLogin = data => ({
  type: actions.LOGIN,
  api: {
    path: "tokens",
    method: "POST",
    body: { user: data },
    successCallback: [
      actions.LOGIN_SUCCESS_CALLBACK,
      {
        action: connectivityActions.QUEUE_STATUS,
        payload: QUEUE_READY
      }
    ]
  }
});
