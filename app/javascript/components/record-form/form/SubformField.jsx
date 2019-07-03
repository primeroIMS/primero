/* eslint-disable react/no-array-index-key  */
/* eslint-disable import/no-cycle */
import React from "react";
import PropTypes from "prop-types";
import { FieldArray } from "formik";
import { Button } from "@material-ui/core";
import { useI18n } from "components/i18n";
import FormSection from "./FormSection";

const SubformField = ({ field, values, mode }) => {
  const {
    display_name: displayName,
    name,
    subform_section_id: subformSectionID
  } = field;

  const i18n = useI18n();

  return (
    <FieldArray
      name={name}
      render={arrayHelpers => {
        return (
          <div>
            <h3>{displayName.en}</h3>
            {values &&
              values[name] &&
              values[name].map((subForm, index) => (
                <div key={index}>
                  <FormSection
                    {...{
                      form: subformSectionID,
                      values,
                      index,
                      mode,
                      arrayHelpers
                    }}
                  />
                </div>
              ))}
            {!mode.isShow && (
              <Button
                size="medium"
                variant="contained"
                onClick={() => arrayHelpers.push({})}
              >
                {i18n.t("form_section.buttons.add")}
              </Button>
            )}
          </div>
        );
      }}
    />
  );
};

SubformField.propTypes = {
  field: PropTypes.object.isRequired,
  values: PropTypes.object,
  mode: PropTypes.object
};

export default SubformField;
