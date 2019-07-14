import React from "react";
import PropTypes from "prop-types";
import { SimpleFileUpload } from "formik-material-ui";
import { FastField, FieldArray } from "formik";
import { Box, IconButton, Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { useI18n } from "components/i18n";

const AttachmentField = ({
  name,
  values,
  label,
  attachment,
  disabled,
  ...props
}) => {
  const i18n = useI18n();

  const fieldProps = {
    component: SimpleFileUpload,
    ...props
  };

  return (
    <FieldArray
      name={name}
      render={arrayHelpers => (
        <Box>
          <h4>{label}</h4>
          {values[name].length > 0
            ? values[name].map((a, index) => {
                return (
                  <Box display="flex" my={2}>
                    <FastField
                      {...fieldProps}
                      name={`${name}[${index}][${attachment}]`}
                      value={values[name][index]}
                    />
                    {!disabled && (
                      <>
                        <IconButton onClick={() => arrayHelpers.remove(index)}>
                          <DeleteIcon />
                        </IconButton>
                        <IconButton onClick={() => arrayHelpers.insert({})}>
                          <AddIcon />
                        </IconButton>
                      </>
                    )}
                  </Box>
                );
              })
            : !disabled && (
                <Button
                  variant="contained"
                  onClick={() => arrayHelpers.insert({})}
                >
                  {i18n.t("form_section.buttons.add")}
                </Button>
              )}
        </Box>
      )}
    />
  );
};

AttachmentField.propTypes = {
  name: PropTypes.string,
  values: PropTypes.object,
  label: PropTypes.string,
  attachment: PropTypes.string.isRequired,
  disabled: PropTypes.bool
};

export default AttachmentField;
