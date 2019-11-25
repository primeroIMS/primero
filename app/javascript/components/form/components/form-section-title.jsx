import React from "react";
import PropTypes from "prop-types";

import { useI18n } from "../../i18n";

const FormSectionTitle = ({ formSection }) => {
  const i18n = useI18n();
  const { name } = formSection;
  const title = i18n.getI18nStringFromObject(name)

  return title ? <h1>{title}</h1> : null;
};

FormSectionTitle.displayName = "FormSectionTitle";

FormSectionTitle.propTypes = {
  formSection: PropTypes.object
};

export default FormSectionTitle;
