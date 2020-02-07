import { Record } from "immutable";

export const MessageRecord = Record({
  message: "",
  dismissed: false,
  options: {},
  actionUrl: "",
  actionLabel: ""
});
