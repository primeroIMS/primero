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
  const providedConsentFormProps = {
    canConsentOverride,
    setDisabled,
    recordType
  };

  return <ProvidedForm {...providedConsentFormProps} />;
};

ProvidedConsent.propTypes = {
  canConsentOverride: PropTypes.bool,
  providedConsent: PropTypes.bool,
  recordType: PropTypes.string,
  setDisabled: PropTypes.func
};

export default ProvidedConsent;
