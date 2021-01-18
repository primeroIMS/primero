import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { FormContext, useForm } from "react-hook-form";
import isEqual from "lodash/isEqual";

import { MODES } from "../../../../../../../config";
import { whichFormMode } from "../../../../../../form";
import FormSection from "../../../../../../form/components/form-section";
import TraceActions from "../trace-actions";
import { FORMS } from "../../constants";

import { NAME } from "./constants";

const Component = ({ setSelectedForm, traceValues, formSection, recordType, selectedForm, handleClose }) => {
  const formMode = whichFormMode(MODES.show);
  const methods = useForm({ defaultValues: traceValues || {} });

  useEffect(() => {
    const currentValues = methods.getValues();

    if (!isEqual(currentValues, traceValues)) {
      methods.reset(traceValues);
    }
  }, [traceValues]);

  const handleConfirm = () => setSelectedForm(FORMS.matches);

  return (
    <>
      <TraceActions
        handleBack={handleClose}
        handleConfirm={handleConfirm}
        selectedForm={selectedForm}
        hasMatch={Boolean(traceValues.matched_case_id)}
        recordType={recordType}
      />
      <FormContext {...methods} formMode={formMode}>
        <FormSection formSection={formSection} showTitle={false} disableUnderline />
      </FormContext>
    </>
  );
};

Component.propTypes = {
  formSection: PropTypes.object.isRequired,
  handleClose: PropTypes.func,
  recordType: PropTypes.string.isRequired,
  selectedForm: PropTypes.string,
  setSelectedForm: PropTypes.func,
  traceValues: PropTypes.object
};

Component.displayName = NAME;

export default Component;
