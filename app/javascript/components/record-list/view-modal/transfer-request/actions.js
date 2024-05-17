// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { namespaceActions } from "../../../../libs";

import NAMESPACE from "./namespace";

const actions = namespaceActions(NAMESPACE, [
  "TRANSFER_REQUEST",
  "TRANSFER_REQUEST_SUCCESS",
  "TRANSFER_REQUEST_STARTED",
  "TRANSFER_REQUEST_FAILURE",
  "TRANSFER_REQUEST_FINISHED"
]);

export default {
  ...actions,
  TRANSFER_REQUEST_URL: "transfer_requests"
};
