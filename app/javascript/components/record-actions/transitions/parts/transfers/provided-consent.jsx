import React from "react";
import PropTypes from "prop-types";

import { PROVIDED_CONSENT_NAME as NAME } from "./constants";
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

ProvidedConsent.displayName = NAME;

ProvidedConsent.propTypes = {
  canConsentOverride: PropTypes.bool,
  providedConsent: PropTypes.bool,
  setDisabled: PropTypes.func
};

export default ProvidedConsent;
