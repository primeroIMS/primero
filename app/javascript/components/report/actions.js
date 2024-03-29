// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { namespaceActions } from "../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "FETCH_REPORT",
  "FETCH_REPORT_STARTED",
  "FETCH_REPORT_SUCCESS",
  "FETCH_REPORT_FAILURE",
  "FETCH_REPORT_FINISHED",
  "DELETE_REPORT",
  "DELETE_REPORT_STARTED",
  "DELETE_REPORT_SUCCESS",
  "DELETE_REPORT_FAILURE",
  "DELETE_REPORT_FINISHED"
]);
