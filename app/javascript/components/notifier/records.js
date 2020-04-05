/* eslint-disable import/prefer-default-export */

import { Record } from "immutable";

export const MessageRecord = Record({
  message: "",
  messageKey: "",
  dismissed: false,
  options: {},
  actionUrl: "",
  actionLabel: ""
});
