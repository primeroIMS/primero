import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";

import { FORM_SECTION_NAME } from "./constants";
import FormSectionField from "./form-section-field";
import FormSectionTitle from "./form-section-title";
import styles from "./styles.css";

const FormSection = ({ formSection }) => {
  const { fields, check_errors: checkErrors } = formSection;
  const css = makeStyles(styles)();
  const renderFields = fieldsToRender => {
    return fieldsToRender.map(field => {
      if (field?.row) {
        return (
          <div
            key={`${formSection.unique_id}-row`}
            className={clsx({
              [css.notEqual]: field.equalColumns === false,
              [css.row]: true
            })}
          >
            {renderFields(field.row)}
          </div>
        );
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

FormSection.displayName = FORM_SECTION_NAME;

FormSection.propTypes = {
  formSection: PropTypes.object
};

export default FormSection;
