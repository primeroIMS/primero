// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { APPROVAL_STATUS } from "../request-approval/constants";
import { APPROVALS_TYPES, RECORD_TYPES } from "../../../config";

import buildApprovalList from "./build-approval-list";

describe("record-actions/utils/build-approval-list", () => {
  const approvalsLabels = fromJS({
    assessment: "Assessment",
    case_plan: "Case Plan",
    closure: "Closure",
    action_plan: "Action Plan",
    gbv_closure: "GBV Closure"
  });

  it("returns only approvals that have pending requests", () => {
    expect(
      buildApprovalList({
        approvalsLabels,
        canApproveActionPlan: true,
        canApproveBia: true,
        canApproveCasePlan: true,
        canApproveClosure: true,
        canApproveGbvClosure: true,
        canRequestBia: true,
        canRequestCasePlan: true,
        canRequestClosure: true,
        canRequestActionPlan: true,
        canRequestGbvClosure: true,
        record: fromJS({
          approval_status_assessment: APPROVAL_STATUS.pending,
          approval_status_closure: APPROVAL_STATUS.pending,
          approval_subforms: [
            {
              unique_id: "001",
              approval_status: APPROVAL_STATUS.requested,
              approval_requested_for: APPROVALS_TYPES.assessment
            },
            {
              unique_id: "002",
              approval_status: APPROVAL_STATUS.requested,
              approval_requested_for: APPROVALS_TYPES.closure
            }
          ]
        })
      }).approvals
    ).toEqual([
      {
        name: approvalsLabels.getIn(["default", APPROVALS_TYPES.assessment]),
        condition: true,
        recordType: RECORD_TYPES.all,
        value: APPROVALS_TYPES.assessment
      },
      {
        name: approvalsLabels.getIn(["default", APPROVALS_TYPES.closure]),
        condition: true,
        recordType: RECORD_TYPES.all,
        value: APPROVALS_TYPES.closure
      }
    ]);
  });

  it("does not return requested approvals if they are not pending", () => {
    expect(
      buildApprovalList({
        approvalsLabels,
        canApproveActionPlan: true,
        canApproveBia: true,
        canApproveCasePlan: true,
        canApproveClosure: true,
        canApproveGbvClosure: true,
        canRequestBia: true,
        canRequestCasePlan: true,
        canRequestClosure: true,
        canRequestActionPlan: true,
        canRequestGbvClosure: true,
        record: fromJS({
          approval_status_assessment: APPROVAL_STATUS.pending,
          approval_status_closure: null,
          approval_subforms: [
            {
              unique_id: "001",
              approval_status: APPROVAL_STATUS.requested,
              approval_requested_for: APPROVALS_TYPES.assessment
            },
            {
              unique_id: "002",
              approval_status: APPROVAL_STATUS.requested,
              approval_requested_for: APPROVALS_TYPES.closure
            }
          ]
        })
      }).approvals
    ).toEqual([
      {
        name: approvalsLabels.getIn(["default", APPROVALS_TYPES.assessment]),
        condition: true,
        recordType: RECORD_TYPES.all,
        value: APPROVALS_TYPES.assessment
      }
    ]);
  });
});
