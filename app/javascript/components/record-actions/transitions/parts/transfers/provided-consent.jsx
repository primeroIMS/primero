import React from "react";
import PropTypes from "prop-types";
import ProvidedForm from "./provided-form";

const ProvidedConsent = ({
  canConsentOverride,
  providedConsent,
  setDisabled
}) => {
  if (providedConsent) {
    return null;
  }

  const providedFormProps = {
    canConsentOverride,
    setDisabled
  };

  return <ProvidedForm {...providedFormProps} />;
};

ProvidedConsent.propTypes = {
  canConsentOverride: PropTypes.bool,
  providedConsent: PropTypes.bool,
  setDisabled: PropTypes.func
};

export default ProvidedConsent;
