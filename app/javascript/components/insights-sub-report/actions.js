// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { namespaceActions } from "../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "FETCH_INSIGHT",
  "FETCH_INSIGHT_STARTED",
  "FETCH_INSIGHT_SUCCESS",
  "FETCH_INSIGHT_FAILURE",
  "FETCH_INSIGHT_FINISHED",
  "CLEAR_REPORT_DATA",
  "CLEAR_SELECTED_INSIGHT",
  "SET_SUB_REPORT"
]);
