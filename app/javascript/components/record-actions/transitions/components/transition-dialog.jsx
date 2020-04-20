/* eslint-disable react/display-name */
import React from "react";
import PropTypes from "prop-types";

import ActionDialog from "../../../action-dialog";

const TransitionDialog = ({
  onClose,
  children,
  confirmButtonLabel,
  omitCloseAfterSuccess,
  open,
  pending,
  record,
  recordType,
  successHandler,
  transitionType,
  enabledSuccessButton
}) => {
  const recordName = {
    cases: "Case",
    tracing_requests: "Tracing request",
    incidents: "Incident"
  };

  const title = (type => {
    if (record) {
      const {
        case_id_display: caseId,
        incident_code: incidentId
      } = record.toJS();
      const recordWithId = `${recordName[recordType]} ${caseId || incidentId}`;

      switch (type) {
        case "referral":
          return `Referral ${recordWithId}`;
        case "reassign":
          return `Assign ${recordWithId}`;
        case "transfer":
          return `Transfer ${recordWithId}`;
        default:
          return null;
      }
    }

    return "";
  })(transitionType);

  const dialogProps = {
    maxWidth: "sm",
    onClose,
    confirmButtonLabel,
    omitCloseAfterSuccess,
    open,
    pending,
    successHandler,
    dialogTitle: title,
    cancelHandler: onClose,
    enabledSuccessButton
  };

  return <ActionDialog {...dialogProps}>{children}</ActionDialog>;
};

TransitionDialog.propTypes = {
  children: PropTypes.node.isRequired,
  confirmButtonLabel: PropTypes.string,
  enabledSuccessButton: PropTypes.bool,
  omitCloseAfterSuccess: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  pending: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  successHandler: PropTypes.func.isRequired,
  transitionType: PropTypes.string
};

export default TransitionDialog;
