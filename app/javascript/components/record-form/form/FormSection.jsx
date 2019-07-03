/* eslint-disable import/no-cycle */
import React from "react";
import PropTypes from "prop-types";
import { Box, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import FormSectionField from "./FormSectionField";

const FormSection = ({ form, values, index, mode, arrayHelpers }) => {
  return (
    <>
      {form.is_nested ? (
        <Box display="flex">
          <Box flexGrow="1">
            <h4>{form.name.en}</h4>
          </Box>
          <Box>
            {!mode.isShow && (
              <>
                <IconButton onClick={() => arrayHelpers.remove(index)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={() => arrayHelpers.push({})}>
                  <AddIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Box>
      ) : (
        <h3>{form.name.en}</h3>
      )}
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
  mode: PropTypes.object,
  arrayHelpers: PropTypes.object
};

export default FormSection;
