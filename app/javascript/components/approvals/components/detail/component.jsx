import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";

import { CASE_PLAN, NAME_DETAIL } from "../../constants";
import DisplayData from "../../../display-data";
import { useApp } from "../../../application";

import { approvalLabel } from "./utils";

const Component = ({ approvalSubform, isRequest, isResponse }) => {
  const { approvalsLabels } = useApp();

  const renderApprovalLabel =
    isRequest && !isResponse ? "approvals.requested_for_label" : "approvals.response_for_label";

  const renderApprovalValue =
    isRequest && !isResponse
      ? approvalsLabels.get(approvalSubform.get("approval_requested_for"))
      : approvalsLabels.get(approvalSubform.get("approval_response_for"));

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
      <Grid container spacing={2} role="section">
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
};

Component.displayName = NAME_DETAIL;

Component.propTypes = {
  approvalSubform: PropTypes.object.isRequired,
  isRequest: PropTypes.bool,
  isResponse: PropTypes.bool
};
export default Component;
