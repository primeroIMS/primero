// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { namespaceActions } from "../../libs";

import { NAMESPACE } from "./constants";

export default namespaceActions(NAMESPACE, [
  "CLEAR_EXPORTED_INSIGHT",
  "EXPORT_INSIGHTS",
  "EXPORT_INSIGHTS_FAILURE",
  "EXPORT_INSIGHTS_FINISHED",
  "EXPORT_INSIGHTS_STARTED",
  "EXPORT_INSIGHTS_SUCCESS"
]);
