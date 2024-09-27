// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import ActionForm from "../action-form";
import { INCIDENT_DIALOG } from "../constants";
import { ACTIONS } from "../../permissions";

import { NAME, INCIDENT_SUBFORM, INCIDENTS_SUBFORM_NAME } from "./constants";
import Fields from "./fields";
import { validationSchema } from "./utils";

function Component({ open, close, pending, recordType, selectedRowsIndex, setPending }) {
  const props = {
    dialogTitle: "actions.incident_details_from_case",
    dialogName: INCIDENT_DIALOG,
    formName: INCIDENT_SUBFORM,
    subFormName: INCIDENTS_SUBFORM_NAME,
    recordAction: ACTIONS.INCIDENT_DETAILS_FROM_CASE,
    creationMessage: "incident.messages.creation_success",
    open,
    close,
    pending,
    recordType,
    selectedRowsIndex,
    setPending,
    validationSchema,
    skipRecordAlerts: true,
    checkVisible: false
  };

  return <ActionForm Fields={Fields} {...props} />;
}

Component.propTypes = {
  close: PropTypes.func,
  open: PropTypes.bool,
  pending: PropTypes.bool,
  records: PropTypes.array,
  recordType: PropTypes.string,
  selectedRowsIndex: PropTypes.array,
  setPending: PropTypes.func
};

Component.displayName = NAME;

export default Component;
