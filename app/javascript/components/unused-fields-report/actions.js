// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { namespaceActions } from "../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "FETCH_UNUSED_FIELDS",
  "FETCH_UNUSED_FIELDS_FAILURE",
  "FETCH_UNUSED_FIELDS_FINISHED",
  "FETCH_UNUSED_FIELDS_STARTED",
  "FETCH_UNUSED_FIELDS_SUCCESS"
]);
