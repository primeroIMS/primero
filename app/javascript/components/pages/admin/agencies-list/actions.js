// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { namespaceActions } from "../../../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "AGENCIES",
  "AGENCIES_STARTED",
  "AGENCIES_SUCCESS",
  "AGENCIES_FAILURE",
  "AGENCIES_FINISHED",
  "CLEAR_METADATA",
  "SET_AGENCIES_FILTER"
]);
