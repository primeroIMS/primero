// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */
import { STATUS_APPROVED, STATUS_REJECTED } from "../../constants";

export const approvalLabel = (isRequest, approvalSubform) => {
  if (isRequest) {
    return "approvals.requested_by";
  }
  if (approvalSubform.get("approval_status") === STATUS_APPROVED) {
    return "approvals.approved_by";
  }
  if (approvalSubform.get("approval_status") === STATUS_REJECTED) {
    return "approvals.rejected_by";
  }

  return "";
};
