// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { namespaceActions } from "../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "FETCH_FLAGS",
  "FETCH_FLAGS_STARTED",
  "FETCH_FLAGS_SUCCESS",
  "FETCH_FLAGS_FINISHED",
  "UNFLAG",
  "UNFLAG_SUCCESS",
  "ADD_FLAG",
  "ADD_FLAG_SUCCESS",
  "UPDATE_FLAG",
  "UPDATE_FLAG_SUCCESS",
  "SET_SELECTED_FLAG",
  "SET_SELECTED_FLAG_SUCCESS"
]);
