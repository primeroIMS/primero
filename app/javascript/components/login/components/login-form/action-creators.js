/* eslint-disable import/prefer-default-export */

import actions from "./actions";

export const attemptLogin = data => ({
  type: actions.LOGIN,
  api: {
    path: "tokens",
    method: "POST",
    body: { user: data },
    successCallback: [actions.LOGIN_SUCCESS_CALLBACK]
  }
});
