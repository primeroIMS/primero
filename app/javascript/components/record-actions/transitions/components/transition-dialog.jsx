// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/display-name */
import PropTypes from "prop-types";

import ActionDialog from "../../../action-dialog";
import { useI18n } from "../../../i18n";
import { RECORD_TYPES } from "../../../../config";
import { MAX_BULK_RECORDS } from "../constants";

const TransitionDialog = ({
  onClose,
  children,
  confirmButtonLabel,
  omitCloseAfterSuccess,
  confirmButtonProps,
  open,
  pending,
  record,
  recordType,
  successHandler,
  transitionType,
  enabledSuccessButton,
  selectedRecordsLength = 0
}) => {
  const i18n = useI18n();

  const title = (type => {
    const caseId = record?.get("case_id_display");
    const incidentId = record?.get("incident_code");
    const recordId = caseId || incidentId || "";

    const recordTypeLabel =
      selectedRecordsLength > 0
        ? i18n.t(`${recordType}.label`)
        : i18n.t(`forms.record_types.${RECORD_TYPES[recordType]}`);
    const recordWithId = `${recordTypeLabel} ${recordId}`;

    const typeLabel = i18n.t(`transition.type.${type}`);

    return `${typeLabel} ${recordWithId}`;
  })(transitionType);

  let dialogSubHeader = null;

  if (selectedRecordsLength > 0 && selectedRecordsLength <= MAX_BULK_RECORDS) {
    dialogSubHeader = i18n.t(`${recordType}.selected_records`, {
      select_records: selectedRecordsLength
    });
  } else if (selectedRecordsLength > MAX_BULK_RECORDS) {
    dialogSubHeader = i18n.t(`${RECORD_TYPES[recordType]}.messages.bulk_assign_limit_try_again`);
  }

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
    dialogSubHeader,
    confirmButtonProps
  };

  return <ActionDialog {...dialogProps}>{children}</ActionDialog>;
};

TransitionDialog.propTypes = {
  children: PropTypes.node.isRequired,
  confirmButtonLabel: PropTypes.string,
  confirmButtonProps: PropTypes.object,
  enabledSuccessButton: PropTypes.bool,
  omitCloseAfterSuccess: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  pending: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  selectedRecordsLength: PropTypes.number,
  successHandler: PropTypes.func,
  transitionType: PropTypes.string
};

export default TransitionDialog;
