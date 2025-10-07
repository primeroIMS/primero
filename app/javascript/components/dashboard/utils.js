// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

import qs from "qs";

import { OR_FIELDS } from "../index-filters";

function getApprovalLabel(approvalsLabels, moduleID, label) {
  return approvalsLabels.getIn([moduleID, label]) || approvalsLabels.getIn(["default", label]);
}

export const buildFilter = (queryValue, isManager = false) => {
  const value = queryValue.reduce((acum, obj) => {
    const [filterName, filterValue] = obj.split("=");

    const valueList = filterValue.split(",");
    const val = valueList.length > 1 ? valueList : [filterValue];

    return {
      ...acum,
      ...(OR_FIELDS.includes(filterName) && !isManager ? { or: { [filterName]: filterValue } } : { [filterName]: val })
    };
  }, {});

  return qs.stringify(value);
};

export const buildItemLabel = (item, approvalsLabels, defaultLabel, titleHasModule) => {
  const [key, moduleID] = titleHasModule ? item.split(".") : [item, "default"];

  switch (key) {
    case "approval_assessment_pending_group":
      return getApprovalLabel(approvalsLabels, moduleID, "assessment");
    case "approval_case_plan_pending_group":
      return getApprovalLabel(approvalsLabels, moduleID, "case_plan");
    case "approval_closure_pending_group":
      return getApprovalLabel(approvalsLabels, moduleID, "closure");
    case "approval_action_plan_pending_group":
      return getApprovalLabel(approvalsLabels, moduleID, "action_plan");
    case "approval_gbv_closure_pending_group":
      return getApprovalLabel(approvalsLabels, moduleID, "gbv_closure");
    default:
      return defaultLabel;
  }
};
