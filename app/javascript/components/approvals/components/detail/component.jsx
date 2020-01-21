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

const Component = ({ approvalSubform, css, isRequest, isResponse }) => {
  const i18n = useI18n();

  const renderApprovalLabel =
    isRequest && !isResponse
      ? i18n.t("approvals.requested_for_label")
      : i18n.t("approvals.response_for_label");

  const renderApprovalValue =
    isRequest && !isResponse
      ? i18n.t(`approvals.${approvalSubform.get("approval_requested_for")}`)
      : i18n.t(`approvals.${approvalSubform.get("approval_response_for")}`);

  const renderCasePlanType =
    isResponse ||
    approvalSubform.get("approval_requested_for") === CASE_PLAN ? (
      <Grid item md={6} xs={12}>
        <Box className={css.spaceGrid}>
          <div className={css.approvalsLabel}>
            {i18n.t("approvals.case_plan_type_label")}
          </div>
          <div className={css.approvalsValue}>
            {approvalSubform.get("approval_for_type")}
          </div>
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

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Box className={css.spaceGrid}>
            <div className={css.approvalsLabel}>{renderApprovalLabel}</div>
            <div className={css.approvalsValue}>{renderApprovalValue}</div>
          </Box>
        </Grid>
        <Grid item md={6} xs={12}>
          <Box className={css.spaceGrid}>
            <div className={css.approvalsLabel}>{renderApprovedByLabel}</div>
            <div className={css.approvalsValue}>
              {approvalSubform.get("approved_by")}
            </div>
          </Box>
        </Grid>
        {renderCasePlanType}
        <Grid item md={12} xs={12}>
          <Box>
            <div className={css.approvalsLabel}>
              {i18n.t("approvals.manager_comments_label")}
            </div>
            <div className={css.approvalsValue}>
              {approvalSubform.get("approval_manager_comments")}
            </div>
          </Box>
        </Grid>
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
