import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { FormContext, useForm } from "react-hook-form";
import isEqual from "lodash/isEqual";

import { MODES } from "../../../../../../../config";
import { whichFormMode } from "../../../../../../form";
import FormSection from "../../../../../../form/components/form-section";
import TraceActions from "../trace-actions";

import { NAME } from "./constants";

const Component = ({ handleBack, traceValues, formSection, selectedForm, handleConfirm }) => {
  const formMode = whichFormMode(MODES.show);
  const methods = useForm({ defaultValues: traceValues || {} });

  useEffect(() => {
    const currentValues = methods.getValues();

    if (!isEqual(currentValues, traceValues)) {
      methods.reset(traceValues);
    }
  }, [traceValues]);

  return (
    <>
      <TraceActions handleBack={handleBack} handleConfirm={handleConfirm} selectedForm={selectedForm} />
      <FormContext {...methods} formMode={formMode}>
        <FormSection formSection={formSection} showTitle={false} disableUnderline />
      </FormContext>
    </>
  );
};

Component.propTypes = {
  formSection: PropTypes.object.isRequired,
  handleBack: PropTypes.func,
  handleConfirm: PropTypes.func,
  selectedForm: PropTypes.string,
  traceValues: PropTypes.object
};

Component.displayName = NAME;

export default Component;
