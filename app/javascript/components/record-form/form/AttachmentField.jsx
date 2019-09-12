/* eslint-disable jsx-a11y/label-has-for */

import React, { useState } from "react";
import PropTypes from "prop-types";
import { FastField, FieldArray, connect, getIn } from "formik";
import { Box, IconButton, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import { useI18n } from "components/i18n";
import styles from "./styles.css";
import DocumentField from "./DocumentField";

// TODO: No link to display / download upload
const AttachmentField = ({ name, field, label, disabled, formik, mode }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const values = getIn(formik.values, name);
  const attachment = {
    photo_upload_box: "image",
    audio_upload_box: "audio",
    document_upload_box: "document"
  }[field.type];

  const [openLastDialog, setOpenLastDialog] = useState(false);

  let initialAttachmentValue = {
    [attachment]: ""
  };

  const handleAttachmentAddition = arrayHelpers => {
    arrayHelpers.push(initialAttachmentValue);

    if (attachment === "document") {
      setOpenLastDialog(true);
    }
  };

  const resetOpenLastDialog = () => {
    setOpenLastDialog(false);
  };

  if (attachment === "document") {
    initialAttachmentValue = Object.assign({}, initialAttachmentValue, {
      document_description: "",
      date: null,
      comments: ""
    });
  }

  const valuesSize = values.length;

  return (
    <FieldArray
      name={name}
      render={arrayHelpers => (
        <Box>
          <div className={css.attachmentHeading}>
            <h4>{label}</h4>
            {disabled && !mode.isShow && (
              <div>
                <IconButton
                  variant="contained"
                  onClick={() => handleAttachmentAddition(arrayHelpers)}
                >
                  <AddIcon />
                </IconButton>
              </div>
            )}
          </div>

          {values.length > 0 &&
            values.map((a, index) => {
              return (
                // eslint-disable-next-line react/no-array-index-key
                <div key={`${attachment}-${index}`}>
                  {attachment === "document" ? (
                    <DocumentField
                      title={`${i18n.t("fields.add")} ${label}`}
                      index={index}
                      name={name}
                      mode={mode}
                      open={valuesSize === index + 1 && openLastDialog}
                      resetOpenLastDialog={resetOpenLastDialog}
                      value={a}
                      removeFunc={arrayHelpers.remove}
                      field={field}
                    />
                  ) : (
                    <Box className={css.uploadBox}>
                      <Box display="flex" my={2} alignItems="center">
                        <Box flexGrow="1">
                          {!mode.isShow && (
                            <>
                              <label
                                htmlFor={`${name}[${index}][${attachment}]`}
                              >
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  component="span"
                                >
                                  {i18n.t(
                                    "fields.file_upload_box.select_file_button_text"
                                  )}
                                </Button>
                              </label>
                              <div className={css.inputField}>
                                <FastField
                                  id={`${name}[${index}][${attachment}]`}
                                  name={`${name}[${index}][${attachment}]`}
                                  type="file"
                                />
                              </div>
                            </>
                          )}
                        </Box>
                        {disabled && !mode.isShow && (
                          <div>
                            <IconButton
                              onClick={() => arrayHelpers.remove(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </div>
                        )}
                      </Box>
                    </Box>
                  )}
                </div>
              );
            })}
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
