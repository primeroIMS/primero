// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { FIELD_NAMES } from "../users-form/constants";
import { CAN_DISABLE_MULTIPLE_USERS, CREATE_RECORDS } from "../../../permissions/constants";

export const LIST_HEADERS = [
  { label: "users.headers.full_name", name: "full_name" },
  { label: "users.headers.user_name", name: "user_name" },
  { label: "users.headers.position", name: "position" },
  { label: "users.headers.agency", name: "agency_id" }
];

export const AGENCY = "agency";
export const USER_GROUP = "user_group_ids";
export const DISABLED = "disabled";
export const LAST_DATE = "last_date";
export const ACTIVITY_FILTERS = Object.freeze([
  FIELD_NAMES.LAST_ACCESS,
  FIELD_NAMES.LAST_CASE_UPDATED,
  FIELD_NAMES.LAST_CASE_VIEWED
]);

export const USERS_DIALOG = "UserDialog";
export const ACTION_IDS = Object.freeze({
  disable: 1
});
export const ACTION_NAMES = Object.freeze({
  disable: "disable"
});
export const DISABLE_DIALOG_NAME = "DisableDialog";
export const USERS_ABILITIES = Object.freeze({
  canAddUsers: CREATE_RECORDS,
  canDisableMultiple: CAN_DISABLE_MULTIPLE_USERS
});
