// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { namespaceActions } from "../../../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "DISABLE_LOCATIONS",
  "DISABLE_LOCATIONS_STARTED",
  "DISABLE_LOCATIONS_SUCCESS",
  "DISABLE_LOCATIONS_FAILURE",
  "DISABLE_LOCATIONS_FINISHED",
  "LOCATIONS",
  "LOCATIONS_STARTED",
  "LOCATIONS_SUCCESS",
  "LOCATIONS_FAILURE",
  "LOCATIONS_FINISHED",
  "SET_LOCATIONS_FILTER"
]);
