// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { namespaceActions } from "../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "FETCH_ACCESS_LOGS",
  "FETCH_ACCESS_LOGS_STARTED",
  "FETCH_ACCESS_LOGS_SUCCESS",
  "FETCH_ACCESS_LOGS_FAILURE",
  "FETCH_ACCESS_LOGS_FINISHED"
]);
