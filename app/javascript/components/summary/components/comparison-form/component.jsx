import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import TraceComparisonForm from "../../../record-form/form/subforms/subform-traces/components/trace-comparison-form";
import { clearSelectedCasePotentialMatch } from "../../../records";

import { NAME } from "./constants";

const Component = ({ selectedForm, recordType, potentialMatch, handleBack }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearSelectedCasePotentialMatch());
    };
  }, []);

  return (
    <>
      <TraceComparisonForm
        selectedForm={selectedForm}
        recordType={recordType}
        potentialMatch={potentialMatch}
        handleBack={handleBack}
      />
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  handleBack: PropTypes.func,
  potentialMatch: PropTypes.object.isRequired,
  recordType: PropTypes.string.isRequired,
  selectedForm: PropTypes.string.isRequired
};

export default Component;
