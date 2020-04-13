import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";

import FormSectionField from "./form-section-field";
import FormSectionTitle from "./form-section-title";
import styles from "./styles.css";

const FormSection = ({ formSection }) => {
  const { fields, check_errors: checkErrors } = formSection;
  const css = makeStyles(styles)();
  const renderFields = fieldsToRender => {
    return fieldsToRender.map(field => {
      if (Array.isArray(field)) {
        return <div className={css.row}>{renderFields(field)}</div>;
      }

      return (
        <FormSectionField
          field={field}
          key={field.name}
          checkErrors={checkErrors}
        />
      );
    });
  };

  return (
    <>
      <FormSectionTitle formSection={formSection} />
      {renderFields(fields)}
    </>
  );
};

FormSection.displayName = "FormSection";

FormSection.propTypes = {
  formSection: PropTypes.object
};

export default FormSection;
