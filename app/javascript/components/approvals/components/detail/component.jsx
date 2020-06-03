import React from "react";
import PropTypes from "prop-types";
import { Box, Grid } from "@material-ui/core";

import { useI18n } from "../../../i18n";
import {
  CASE_PLAN,
  NAME_DETAIL,
  STATUS_APPROVED,
  STATUS_REJECTED
} from "../../constants";
import DisplayData from "../../../display-data";
import { useApp } from "../../../application";

const Component = ({ approvalSubform, css, isRequest, isResponse }) => {
  const i18n = useI18n();
  const { approvalsLabels } = useApp();

  const renderApprovalLabel =
    isRequest && !isResponse
      ? i18n.t("approvals.requested_for_label")
      : i18n.t("approvals.response_for_label");

  const renderApprovalValue =
    isRequest && !isResponse
      ? approvalsLabels[approvalSubform.get("approval_requested_for")]
      : approvalsLabels[approvalSubform.get("approval_response_for")];

  const renderCasePlanType =
    approvalSubform.get("approval_response_for") === CASE_PLAN ||
    approvalSubform.get("approval_requested_for") === CASE_PLAN ? (
      <Grid item md={6} xs={12}>
        <Box className={css.spaceGrid}>
          <DisplayData
            label={i18n.t("approvals.case_plan_type_label")}
            value={approvalSubform.get("approval_for_type")}
          />
        </Box>
      </Grid>
    ) : null;

  let renderApprovedByLabel;

  if (isRequest) {
    renderApprovedByLabel = i18n.t("approvals.requested_by");
  } else if (approvalSubform.get("approval_status") === STATUS_APPROVED) {
    renderApprovedByLabel = i18n.t("approvals.approved_by");
  } else if (approvalSubform.get("approval_status") === STATUS_REJECTED) {
    renderApprovedByLabel = i18n.t("approvals.rejected_by");
  }

  const renderManagerComments = isResponse ? (
    <Grid item md={12} xs={12}>
      <Box>
        <DisplayData
          label={i18n.t("approvals.manager_comments_label")}
          value={approvalSubform.get("approval_manager_comments")}
        />
      </Box>
    </Grid>
  ) : null;

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Box className={css.spaceGrid}>
            <DisplayData
              label={renderApprovalLabel}
              value={renderApprovalValue}
            />
          </Box>
        </Grid>
        <Grid item md={6} xs={12}>
          <Box className={css.spaceGrid}>
            <DisplayData
              label={renderApprovedByLabel}
              value={
                approvalSubform.get("approved_by", false) ||
                approvalSubform.get("requested_by")
              }
            />
          </Box>
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
  css: PropTypes.object.isRequired,
  isRequest: PropTypes.bool,
  isResponse: PropTypes.bool
};
export default Component;
