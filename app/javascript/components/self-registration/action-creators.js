// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

import { ROUTES } from "../../config";

import actions from "./actions";

export const registerUser = data => ({
  type: actions.REGISTER,
  api: {
    path: "users/self-register",
    method: "POST",
    body: { user: data },
    successCallback: [
      {
        action: actions.REGISTER_SUCCESS_REDIRECT,
        redirectWithIdFromResponse: false,
        redirect: ROUTES.self_registration_success
      }
    ]
  }
});
