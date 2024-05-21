// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { APPROVALS, APPROVALS_TYPES } from "../../../config/constants";

export default (item, i18n, approvalsLabels) => {
  switch (item) {
    case `${APPROVALS}.${APPROVALS_TYPES.assessment}`:
      return approvalsLabels.get("assessment");
    case `${APPROVALS}.${APPROVALS_TYPES.case_plan}`:
      return approvalsLabels.get("case_plan");
    case `${APPROVALS}.${APPROVALS_TYPES.closure}`:
      return approvalsLabels.get("closure");
    case `${APPROVALS}.${APPROVALS_TYPES.action_plan}`:
      return approvalsLabels.get("action_plan");
    case `${APPROVALS}.${APPROVALS_TYPES.gbv_closure}`:
      return approvalsLabels.get("gbv_closure");
    default:
      return i18n.t(item);
  }
};
