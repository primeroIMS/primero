// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import { useMemoizedSelector } from "../../../libs";
import { getServicesForm } from "../../application/selectors";
import Fields from "../add-incident/fields";
import { ACTIONS } from "../../permissions";
import { SERVICE_DIALOG } from "../constants";
import ActionForm from "../action-form";

import { NAME, SERVICES_SUBFORM_NAME } from "./constants";

function Component({ open, close, pending, recordType, selectedRowsIndex, setPending, primeroModule }) {
  const servicesFormId = useMemoizedSelector(state => getServicesForm(state, primeroModule));

  const props = {
    dialogTitle: "actions.services_section_from_case",
    dialogName: SERVICE_DIALOG,
    formName: servicesFormId,
    subFormName: SERVICES_SUBFORM_NAME,
    recordAction: ACTIONS.SERVICES_SECTION_FROM_CASE,
    creationMessage: "actions.services_from_case_creation_success",
    open,
    close,
    pending,
    recordType,
    selectedRowsIndex,
    setPending,
    skipRecordAlerts: false
  };

  return <ActionForm Fields={Fields} {...props} />;
}

Component.propTypes = {
  close: PropTypes.func,
  open: PropTypes.bool,
  pending: PropTypes.bool,
  primeroModule: PropTypes.string,
  records: PropTypes.array,
  recordType: PropTypes.string,
  selectedRowsIndex: PropTypes.array,
  setPending: PropTypes.func
};

Component.displayName = NAME;

export default Component;
