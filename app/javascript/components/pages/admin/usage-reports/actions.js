// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { namespaceActions } from "../../../../libs";

import { NAMESPACE } from "./constants";

export default namespaceActions(NAMESPACE, [
  "CLEAR_EXPORTED_USAGE_REPORT",
  "FETCH_USAGE_REPORTS",
  "FETCH_USAGE_REPORTS_FAILURE",
  "FETCH_USAGE_REPORTS_FINISHED",
  "FETCH_USAGE_REPORTS_STARTED",
  "FETCH_USAGE_REPORTS_SUCCESS"
]);
