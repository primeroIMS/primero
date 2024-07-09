// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { namespaceActions } from "../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "CLEAR_SELECTED_REPORT",
  "SAVE_REPORT",
  "SAVE_REPORT_FAILURE",
  "SAVE_REPORT_FINISHED",
  "SAVE_REPORT_STARTED",
  "SAVE_REPORT_SUCCESS"
]);
