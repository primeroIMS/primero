// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export const NAME = "ChangeLogs";
export const APPROVALS = "approval_subforms";
export const INCIDENTS = "incidents";
export const SUBFORM = "subform";
export const CREATE_ACTION = "create";
export const EXCLUDED_LOG_ACTIONS = ["flag", "unflag", "reopened_logs"];
export const EMPTY_VALUE = "--";
export const TYPE = Object.freeze({
  added: "added",
  updated: "updated",
  deleted: "deleted"
});
export const PER_PAGE = 20;
export const FIRST_PAGE_RESULTS = 1;
