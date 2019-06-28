/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-cycle */
import React from "react";
import PropTypes from "prop-types";
import { FieldArray } from "formik";
import { Button } from "@material-ui/core";
import FormSection from "./FormSection";

const SubformField = ({ field, values, mode }) => {
  const {
    display_name: displayName,
    name,
    subform_section: subformSection
  } = field;
  return (
    <FieldArray
      name={name}
      render={arrayHelpers => {
        return (
          <div>
            <h3>{displayName.en}</h3>
            {values[name].map((subForm, index) => (
              <div key={index}>
                <FormSection
                  {...{ form: subformSection, values, index, mode }}
                />
                {!mode.isShow && (
                  <Button onClick={() => arrayHelpers.remove(index)}>
                    Remove
                  </Button>
                )}
              </div>
            ))}
            {!mode.isShow && (
              <Button onClick={() => arrayHelpers.push({})}>Add</Button>
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
