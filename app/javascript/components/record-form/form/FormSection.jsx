/* eslint-disable import/no-cycle */
import React from "react";
import PropTypes from "prop-types";
import { Box } from "@material-ui/core";
import FormSectionField from "./FormSectionField";

const FormSection = ({ form, values, index, mode }) => {
  return (
    <>
      {form.is_subform ? <h4>{form.name.en} </h4> : <h3>{form.name.en}</h3>}
      {form.fields.map(field => (
        <Box my={3} key={field.name}>
          <FormSectionField {...{ field, index, values, form, mode }} />
        </Box>
      ))}
    </>
  );
};

FormSection.propTypes = {
  form: PropTypes.object,
  values: PropTypes.object,
  index: PropTypes.number,
  mode: PropTypes.object
};

export default FormSection;
