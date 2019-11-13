import React from "react";
import PropTypes from "prop-types";
import ProvidedForm from "./provided-form";

const ProvidedConsent = ({
  canConsentOverride,
  providedConsent,
  setDisabled,
  recordType
}) => {
  if (providedConsent) {
    return null;
  }

  const providedFormProps = {
    canConsentOverride,
    setDisabled,
    recordType
  };

  return <ProvidedForm {...providedFormProps} />;
};

ProvidedConsent.propTypes = {
  canConsentOverride: PropTypes.bool,
  providedConsent: PropTypes.bool,
  setDisabled: PropTypes.func
};

export default ProvidedConsent;
