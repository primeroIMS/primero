// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

import { Record } from "immutable";

export const MessageRecord = Record({
  message: "",
  messageFromQueue: "",
  messageKey: "",
  messageParams: {},
  messageDetailed: null,
  recordType: "",
  dismissed: false,
  options: {},
  actionUrl: "",
  actionLabel: "",
  noDismiss: false
});
