/* eslint-disable import/no-cycle */
import React from "react";
import PropTypes from "prop-types";
import { Box, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import FormSectionField from "./FormSectionField";
import styles from "./styles.css";

const FormSection = ({
  form,
  values,
  index,
  mode,
  arrayHelpers,
  parentField
}) => {
  const css = makeStyles(styles)();

  return (
    <>
      {form.is_nested ? (
        <Box display="flex">
          <Box flexGrow="1">
            <h3 className={css.subformHeading}>{form.name.en}</h3>
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
        <h1 className={css.formHeading}>{form.name.en}</h1>
      )}
      {form.fields.map(field => (
        <Box my={3} key={field.name}>
          <FormSectionField
            {...{ field, index, values, form, mode, parentField }}
          />
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
  arrayHelpers: PropTypes.object,
  parentField: PropTypes.object
};

export default FormSection;
