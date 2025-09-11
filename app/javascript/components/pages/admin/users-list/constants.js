// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { FIELD_NAMES } from "../users-form/constants";

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
export const ACTIVITY_FILTERS = Object.freeze([FIELD_NAMES.LAST_ACCESS, FIELD_NAMES.LAST_CASE_UPDATED, FIELD_NAMES.LAST_CASE_VIEWED]);
