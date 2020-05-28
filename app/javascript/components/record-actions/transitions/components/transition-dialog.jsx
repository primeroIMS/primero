/* eslint-disable react/display-name */
import React from "react";
import PropTypes from "prop-types";

import ActionDialog from "../../../action-dialog";
import { useI18n } from "../../../i18n";
import { RECORD_TYPES } from "../../../../config";

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
  enabledSuccessButton,
  selectedIds
}) => {
  const i18n = useI18n();

  const title = (type => {
    const recordSelected = record ? record.toJS() : {};
    const {
      case_id_display: caseId,
      incident_code: incidentId
    } = recordSelected;
    const recordId = caseId || incidentId || "";

    const recordTypeLabel =
      selectedIds && selectedIds.length
        ? i18n.t(`${recordType}.label`)
        : i18n.t(`forms.record_types.${RECORD_TYPES[recordType]}`);
    const recordWithId = `${recordTypeLabel} ${recordId}`;

    const typeLabel = i18n.t(`transition.type.${type}`);

    return `${typeLabel} ${recordWithId}`;
  })(transitionType);

  const dialogSubHeader =
    selectedIds && selectedIds.length
      ? i18n.t(`${recordType}.selected_records`, {
          select_records: selectedIds.length
        })
      : null;

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
    enabledSuccessButton,
    dialogSubHeader
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
  selectedIds: PropTypes.array,
  successHandler: PropTypes.func.isRequired,
  transitionType: PropTypes.string
};

export default TransitionDialog;
