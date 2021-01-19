/* eslint-disable import/prefer-default-export */

import actions from "../login-form/actions";

export const attemptIDPLogin = () => {
  return {
    type: actions.LOGIN_SUCCESS_CALLBACK
  };
};
