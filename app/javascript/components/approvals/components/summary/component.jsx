// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Grid } from "@mui/material";
import Chip from "@mui/material/Chip";
import { cx } from "@emotion/css";

import { useI18n } from "../../../i18n";
import { NAME_SUMMARY } from "../../constants";
import { useApp } from "../../../application";

function Component({ approvalSubform, css, isRequest, isResponse, primeroModule }) {
  const i18n = useI18n();
  const { approvalsLabels } = useApp();
  const status = approvalSubform.get("approval_status");

  const getApprovalLabel = label => {
    return approvalsLabels.getIn([primeroModule, label], approvalsLabels.getIn(["default", label]));
  };

  const title =
    isRequest && !isResponse ? i18n.t("approvals.requested_for_title") : i18n.t("approvals.response_for_title");

  const renderApprovalValue =
    isRequest && !isResponse
      ? getApprovalLabel(approvalSubform.get("approval_requested_for"))
      : getApprovalLabel(approvalSubform.get("approval_response_for"));

  const classes = cx(css.chip, css[status]);

  const renderStatus = isResponse ? (
    <Grid item md={2} xs={4}>
      <div className={css.approvalsStatus}>
        <Chip label={i18n.t(`approvals.status.${status}`)} className={classes} size="small" />
      </div>
    </Grid>
  ) : null;

  const renderApprovalDate = () => {
    const approvalDate = approvalSubform.get("approval_date", false);

    if (!approvalDate) {
      return false;
    }

    return i18n.localizeDate(approvalDate);
  };

  return (
    <Grid container spacing={2} alignItems="center" data-testid="approval-summary">
      <Grid item md={10} xs={8}>
        <div className={css.wrapper}>
          {/* TODO: The date should be localized */}
          <div className={css.titleHeader}>{renderApprovalDate()}</div>
          <div className={css.approvalsValueSummary}>
            {renderApprovalValue} - {title}
          </div>
        </div>
      </Grid>
      {renderStatus}
    </Grid>
  );
}

Component.displayName = NAME_SUMMARY;

Component.propTypes = {
  approvalSubform: PropTypes.object.isRequired,
  css: PropTypes.object.isRequired,
  isRequest: PropTypes.bool,
  isResponse: PropTypes.bool,
  primeroModule: PropTypes.string
};
export default Component;
