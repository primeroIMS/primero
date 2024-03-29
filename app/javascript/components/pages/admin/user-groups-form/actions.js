// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { namespaceActions } from "../../../../libs";
import NAMESPACE from "../namespace";

export default namespaceActions(NAMESPACE, [
  "CLEAR_SELECTED_USER_GROUP",
  "FETCH_USER_GROUP",
  "FETCH_USER_GROUP_STARTED",
  "FETCH_USER_GROUP_SUCCESS",
  "FETCH_USER_GROUP_FINISHED",
  "FETCH_USER_GROUP_FAILURE",
  "SAVE_USER_GROUP",
  "SAVE_USER_GROUP_STARTED",
  "SAVE_USER_GROUP_FINISHED",
  "SAVE_USER_GROUP_SUCCESS",
  "SAVE_USER_GROUP_FAILURE"
]);
