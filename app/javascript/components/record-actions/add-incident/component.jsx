import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { useI18n } from "../../i18n";
import { getRecordForms, constructInitialValues } from "../../record-form";
import { MODULES, RECORD_TYPES } from "../../../config";
import StepperModal from "../stepper-modal";

import { NAME, INCIDENT_SUBFORM_NAME, SEPARATOR_FIELD_TYPE } from "./constants";

const Component = ({ openIncidentDialog, close, recordType }) => {
  const i18n = useI18n();
  const [activeStep, setActiveStep] = useState(0);
  const form = useSelector(state =>
    getRecordForms(state, {
      recordType: RECORD_TYPES[recordType],
      primeroModule: MODULES.CP
    })
  ).filter(f => f.unique_id === INCIDENT_SUBFORM_NAME);

  useEffect(() => {
    if (!openIncidentDialog) {
      setActiveStep(0);
    }
  }, [openIncidentDialog]);

  if (!form?.toJS()?.length) return null;

  const subformSectionID = form.first().fields[0].subform_section_id;
  const initialFormValues = constructInitialValues([subformSectionID]);
  const subformFields = subformSectionID?.toJS().fields;

  const totalSteps =
    subformFields &&
    subformFields.filter(sf => sf.type === SEPARATOR_FIELD_TYPE).length - 1;

  let stepCount = -1;
  const fields =
    subformFields &&
    subformFields.reduce((acc, obj) => {
      const field = obj;

      if (obj.type === SEPARATOR_FIELD_TYPE) {
        stepCount += 1;
      }
      field.step = stepCount;

      return [...acc, field];
    }, []);

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const modalProps = {
    open: openIncidentDialog,
    successHandler: () => {},
    dialogTitle: i18n.t("actions.incident_details_from_case"),
    dialogTitleSmall: `Step ${activeStep + 1} of ${totalSteps + 1}`,
    confirmButtonLabel: i18n.t("buttons.save"),
    onClose: close,
    hideModalActions: true
  };

  const formProps = {
    initialValues: initialFormValues,
    onSubmit: () => {}
  };

  const stepperModalProps = {
    activeStep,
    fields,
    formProps,
    handleBack,
    handleNext,
    handleSaveAndAction: () => {},
    modalProps,
    recordType,
    totalSteps
  };

  return <StepperModal {...stepperModalProps} />;
};

Component.propTypes = {
  close: PropTypes.func,
  openIncidentDialog: PropTypes.bool,
  records: PropTypes.array,
  recordType: PropTypes.string,
  selectedRowsIndex: PropTypes.array
};

Component.displayName = NAME;

export default Component;
