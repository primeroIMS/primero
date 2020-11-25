/* eslint-disable import/prefer-default-export */

import { Record } from "immutable";

export const MessageRecord = Record({
  message: "",
  messageFromQueue: "",
  messageKey: "",
  messageParams: {},
  recordType: "",
  dismissed: false,
  options: {},
  actionUrl: "",
  actionLabel: "",
  noDismiss: false
});
