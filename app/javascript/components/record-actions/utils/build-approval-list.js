// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { RECORD_TYPES, APPROVALS_TYPES } from "../../../config";
import { APPROVAL_STATUS } from "../request-approval/constants";

import getRequestedApprovals from "./get-requested-approvals";

export default ({
  approvalsLabels,
  canApproveActionPlan,
  canApproveBia,
  canApproveCasePlan,
  canApproveClosure,
  canApproveGbvClosure,
  canRequestBia,
  canRequestCasePlan,
  canRequestClosure,
  canRequestActionPlan,
  canRequestGbvClosure,
  record
}) => {
  const requestedApprovals = getRequestedApprovals(record);
  const pendingApprovalsFilterFn = ([approval]) =>
    requestedApprovals.includes(approval) && record.get(`approval_status_${approval}`) === APPROVAL_STATUS.pending;

  const mapFunction = ([name, ability]) => ({
    name: approvalsLabels.getIn([record?.get("module_id"), name], approvalsLabels.getIn(["default", name])),
    condition: ability,
    recordType: RECORD_TYPES.all,
    value: APPROVALS_TYPES[name]
  });

  return {
    approvals: [
      [APPROVALS_TYPES.assessment, canApproveBia],
      [APPROVALS_TYPES.case_plan, canApproveCasePlan],
      [APPROVALS_TYPES.closure, canApproveClosure],
      [APPROVALS_TYPES.action_plan, canApproveActionPlan],
      [APPROVALS_TYPES.gbv_closure, canApproveGbvClosure]
    ]
      .filter(pendingApprovalsFilterFn)
      .map(mapFunction),
    requestsApproval: [
      [APPROVALS_TYPES.assessment, canRequestBia],
      [APPROVALS_TYPES.case_plan, canRequestCasePlan],
      [APPROVALS_TYPES.closure, canRequestClosure],
      [APPROVALS_TYPES.action_plan, canRequestActionPlan],
      [APPROVALS_TYPES.gbv_closure, canRequestGbvClosure]
    ].map(mapFunction)
  };
};
