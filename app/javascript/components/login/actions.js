// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { namespaceActions } from "../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "LOGIN",
  "LOGIN_SUCCESS",
  "LOGIN_STARTED",
  "LOGIN_FAILURE",
  "LOGIN_FINISHED"
]);
