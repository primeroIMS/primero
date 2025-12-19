// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import { METHODS } from "../../config";

import actions from "./actions";

/* eslint-disable import/prefer-default-export */
export const acceptTermsOfUse = ({ userId, path }) => ({
  type: actions.ACCEPT_TERMS_OF_USE,
  api: {
    path: `users/${userId}/accept_terms_of_use`,
    method: METHODS.PATCH,
    successCallback: {
      action: "terms_of_use/REDIRECT",
      redirect: path
    }
  }
});
