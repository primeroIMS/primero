// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { namespaceActions } from "../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "FECTH_ACTIVITY_LOGS",
  "FECTH_ACTIVITY_LOGS_STARTED",
  "FECTH_ACTIVITY_LOGS_SUCCESS",
  "FECTH_ACTIVITY_LOGS_FAILURE",
  "FECTH_ACTIVITY_LOGS_FINISHED",
  "SET_ACTIVITY_LOGS_FILTER"
]);
