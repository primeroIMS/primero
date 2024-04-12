// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { namespaceActions } from "../../../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "LOGIN",
  "LOGIN_STARTED",
  "LOGIN_SUCCESS",
  "LOGIN_FINISHED",
  "LOGIN_FAILURE",
  "LOGIN_SUCCESS_CALLBACK"
]);
