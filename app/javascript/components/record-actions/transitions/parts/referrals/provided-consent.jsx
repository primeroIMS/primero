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
  const providedConsentFormProps = {
    canConsentOverride,
    setDisabled
  };

  return <ProvidedForm {...providedConsentFormProps} />;
};

ProvidedConsent.propTypes = {
  canConsentOverride: PropTypes.bool,
  providedConsent: PropTypes.bool,
  setDisabled: PropTypes.func
};

export default ProvidedConsent;
