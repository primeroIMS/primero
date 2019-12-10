import React from "react";
import PropTypes from "prop-types";

import FormSectionField from "./form-section-field";
import FormSectionTitle from "./form-section-title";

const FormSection = ({ formSection }) => {
  const { fields } = formSection;

  return (
    <>
      <FormSectionTitle formSection={formSection} />

      {fields.map(field => {
        return <FormSectionField field={field} key={field.name} />;
      })}
    </>
  );
};

FormSection.displayName = "FormSection";

FormSection.propTypes = {
  formSection: PropTypes.object
};

export default FormSection;
