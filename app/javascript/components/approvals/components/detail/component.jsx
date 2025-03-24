// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Grid } from "@mui/material";

import { CASE_PLAN, NAME_DETAIL } from "../../constants";
import DisplayData from "../../../display-data";
import { useApp } from "../../../application";

import { approvalLabel } from "./utils";

function Component({ approvalSubform, isRequest, isResponse, primeroModule }) {
  const { approvalsLabels } = useApp();

  const getApprovalLabel = label => {
    return approvalsLabels.getIn([primeroModule, label], approvalsLabels.getIn(["default", label]));
  };

  const renderApprovalLabel =
    isRequest && !isResponse ? "approvals.requested_for_label" : "approvals.response_for_label";

  const renderApprovalValue =
    isRequest && !isResponse
      ? getApprovalLabel(approvalSubform.get("approval_requested_for"))
      : getApprovalLabel(approvalSubform.get("approval_response_for"));

  const renderCasePlanType =
    approvalSubform.get("approval_response_for") === CASE_PLAN ||
    approvalSubform.get("approval_requested_for") === CASE_PLAN ? (
      <Grid item md={6} xs={12}>
        <DisplayData label="approvals.case_plan_type_label" value={approvalSubform.get("approval_for_type")} />
      </Grid>
    ) : null;

  const renderApprovedByLabel = approvalLabel(isRequest, approvalSubform);

  const renderManagerComments = isResponse ? (
    <Grid item md={12} xs={12}>
      <DisplayData label="approvals.manager_comments_label" value={approvalSubform.get("approval_manager_comments")} />
    </Grid>
  ) : null;

  return (
    <>
      <Grid container spacing={2} data-testid="approval-detail">
        <Grid item md={6} xs={12}>
          <DisplayData label={renderApprovalLabel} value={renderApprovalValue} />
        </Grid>
        <Grid item md={6} xs={12}>
          <DisplayData
            label={renderApprovedByLabel}
            value={approvalSubform.get("approved_by", false) || approvalSubform.get("requested_by")}
          />
        </Grid>
        {renderCasePlanType}
        {renderManagerComments}
      </Grid>
    </>
  );
}

Component.displayName = NAME_DETAIL;

Component.propTypes = {
  approvalSubform: PropTypes.object.isRequired,
  isRequest: PropTypes.bool,
  isResponse: PropTypes.bool,
  primeroModule: PropTypes.string
};

export default Component;
