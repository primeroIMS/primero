// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

import actions from "../login-form/actions";

export const attemptIDPLogin = () => {
  return {
    type: actions.LOGIN,
    api: {
      path: "tokens",
      method: "POST",
      successCallback: actions.LOGIN_SUCCESS_CALLBACK
    }
  };
};
