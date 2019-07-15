import React from "react";
import PropTypes from "prop-types";
import {
  SimpleFileUpload,
  TextField as MuiTextField
} from "formik-material-ui";
import { FastField, FieldArray, connect, getIn } from "formik";
import { Box, IconButton, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { useI18n } from "components/i18n";
import DateField from "./DateField";
import styles from "./styles.css";

// TODO: No link to display / download upload
const AttachmentField = ({
  name,
  field,
  label,
  disabled,
  formik,
  mode,
  ...props
}) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  const fieldProps = {
    component: SimpleFileUpload,
    ...props
  };

  const values = getIn(formik.values, name);

  const attachment = {
    photo_upload_box: "image",
    audio_upload_box: "audio",
    document_upload_box: "document"
  }[field.type];

  let initialAttachmentValue = {
    [attachment]: null
  };

  if (attachment === "document") {
    initialAttachmentValue = Object.assign({}, initialAttachmentValue, {
      document_description: "",
      date: null,
      comments: ""
    });
  }

  const supportingInputsProps = {
    readOnly: mode.isShow,
    fullWidth: true,
    autoComplete: "off",
    InputProps: {
      readOnly: mode.isShow,
      classes: {
        root: css.input
      }
    },
    InputLabelProps: {
      shrink: true,
      classes: {
        root: css.inputLabel
      }
    }
  };

  return (
    <FieldArray
      name={name}
      render={arrayHelpers => (
        <Box>
          <h4>{label}</h4>
          {values.length > 0 &&
            values.map((a, index) => {
              return (
                <Box className={css.uploadBox}>
                  <Box display="flex" my={2}>
                    <Box flexGrow="1">
                      {!mode.isShow && (
                        <FastField
                          {...fieldProps}
                          name={`${name}[${index}][${attachment}]`}
                        />
                      )}
                    </Box>
                    {disabled && !mode.isShow && (
                      <Box mx={4}>
                        <IconButton onClick={() => arrayHelpers.remove(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  {attachment === "document" && (
                    <>
                      <Box my={2}>
                        <FastField
                          component={MuiTextField}
                          {...supportingInputsProps}
                          label={i18n.t("fields.name")}
                          name={`${name}[${index}][document_description]`}
                        />
                      </Box>
                      <Box my={2}>
                        <DateField
                          {...supportingInputsProps}
                          readOnly={mode.isShow}
                          name={`${name}[${index}][date]`}
                          label={i18n.t("fields.date")}
                        />
                      </Box>
                      <Box my={2}>
                        <FastField
                          component={MuiTextField}
                          {...supportingInputsProps}
                          multiline
                          label={i18n.t("fields.comments")}
                          name={`${name}[${index}][comments]`}
                        />
                      </Box>
                    </>
                  )}
                </Box>
              );
            })}
          {disabled && !mode.isShow && (
            <Button
              variant="contained"
              onClick={() => arrayHelpers.insert(initialAttachmentValue)}
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
  field: PropTypes.object,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  formik: PropTypes.object,
  mode: PropTypes.object
};

export default connect(AttachmentField);
