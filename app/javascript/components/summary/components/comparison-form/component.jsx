// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import TraceComparisonForm from "../../../record-form/form/subforms/subform-traces/components/trace-comparison-form";
import { clearSelectedCasePotentialMatch } from "../../../records";
import { RECORD_TYPES_PLURAL } from "../../../../config";

import { NAME } from "./constants";

function Component({ selectedForm, recordType, potentialMatch, setSelectedForm }) {
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
        recordType={RECORD_TYPES_PLURAL[recordType]}
        potentialMatch={potentialMatch}
        setSelectedForm={setSelectedForm}
        hideFindMatch
      />
    </>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  potentialMatch: PropTypes.object.isRequired,
  recordType: PropTypes.string.isRequired,
  selectedForm: PropTypes.string.isRequired,
  setSelectedForm: PropTypes.func
};

export default Component;
