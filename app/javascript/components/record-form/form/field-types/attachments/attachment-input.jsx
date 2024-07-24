// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useState } from "react";
import PropTypes from "prop-types";
import { FastField } from "formik";
import { useDispatch } from "react-redux";
import { FormHelperText } from "@mui/material";

import { MAX_ATTACHMENT_SIZE } from "../../../../../config";
import { toBase64 } from "../../../../../libs";
import css from "../../styles.css";
import ActionButton from "../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../action-button/constants";
import { enqueueSnackbar, SNACKBAR_VARIANTS } from "../../../../notifier";
import { get } from "../../../../form/utils";

import { ATTACHMENT_TYPES, ATTACHMENT_ACCEPTED_TYPES } from "./constants";
import renderPreview from "./render-preview";

function AttachmentInput({ attachment, fields, name, value, deleteButton }) {
  const dispatch = useDispatch();

  const [file, setFile] = useState({
    loading: false,
    data: null,
    fileName: ""
  });

  const loadingFile = (loading, data) => {
    setFile({
      loading,
      data: `${data?.content}${data?.result}`,
      fileName: data?.fileName
    });
  };

  const handleChange = async (form, event) => {
    const selectedFile = event?.target?.files?.[0];

    if (selectedFile.size > MAX_ATTACHMENT_SIZE) {
      dispatch(enqueueSnackbar("", { messageKey: "fields.attachment_too_large", type: SNACKBAR_VARIANTS.error }));

      return;
    }

    loadingFile(true);

    if (selectedFile) {
      const data = await toBase64(selectedFile, attachment);

      if (data) {
        loadingFile(false, data);

        form.setFieldValue(fields.contentType, data?.fileType);
        form.setFieldValue(fields.fileName, data?.fileName);
        form.setFieldValue(fields.attachmentType, attachment);
        form.setFieldValue(fields.fieldName, name);
        form.setFieldValue(fields.attachment, data?.result, true);

        if ([ATTACHMENT_TYPES.photo, ATTACHMENT_TYPES.audio].includes(attachment)) {
          form.setFieldValue(fields.date, new Date());
        }
      }
    }
  };

  const acceptedType = ATTACHMENT_ACCEPTED_TYPES[attachment] || "*";

  const fieldDisabled = () => file?.loading || (value && !file?.data);

  return (
    <div className={css.attachment}>
      <FastField>
        {({ form }) => {
          const handleOnChange = event => handleChange(form, event);
          const error = get(form.errors, "attachment", "");

          return (
            <div>
              <label htmlFor={fields.attachment}>
                <div className={css.buttonWrapper}>
                  {!file?.data && (
                    <ActionButton
                      text="fields.file_upload_box.select_file_button_text"
                      type={ACTION_BUTTON_TYPES.default}
                      pending={file?.loading}
                      rest={{
                        component: "span",
                        disabled: fieldDisabled(),
                        variant: "outlined"
                      }}
                    />
                  )}
                </div>
              </label>
              <div className={css.inputField}>
                <input
                  id={fields.attachment}
                  name={fields.attachment}
                  onChange={handleOnChange}
                  disabled={fieldDisabled()}
                  data-testid="input-file"
                  type="file"
                  accept={acceptedType}
                />
              </div>
              {error && (
                <FormHelperText className={css.attachmentError} data-testid="attachment-field-error" error>
                  {error}
                </FormHelperText>
              )}
            </div>
          );
        }}
      </FastField>
      {file && renderPreview(attachment, file, css, deleteButton)}
    </div>
  );
}

AttachmentInput.displayName = "AttachmentInput";

AttachmentInput.propTypes = {
  attachment: PropTypes.string.isRequired,
  deleteButton: PropTypes.node,
  fields: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string
};

export default AttachmentInput;
