import React, { useState } from "react";
import PropTypes from "prop-types";
import { FastField } from "formik";
import { makeStyles } from "@material-ui/styles";

import { useI18n } from "../../../../i18n";
import { toBase64 } from "../../../../../libs";
import styles from "../../styles.css";
import ActionButton from "../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../action-button/constants";

import { ATTACHMENT_TYPES } from "./constants";
import renderPreview from "./render-preview";

const AttachmentInput = ({ attachment, fields, name, value }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const [file, setFile] = useState({
    loading: false,
    data: null,
    fileName: ""
  });

  const loadingFile = (loading, data) => {
    setFile({
      loading,
      data: `${data?.content}${data?.result}`,
      fileName: data?.name
    });
  };

  const handleChange = (form, event) => {
    const selectedFile = event?.target?.files?.[0];

    loadingFile(true);

    if (selectedFile) {
      toBase64(selectedFile).then(data => {
        form.setFieldValue(fields.attachment, data?.result, true);
        form.setFieldValue(fields.contentType, data?.fileType, true);
        form.setFieldValue(fields.fileName, data?.fileName, true);
        form.setFieldValue(fields.attachmentType, attachment, true);
        form.setFieldValue(fields.fieldName, name, true);

        if (
          [ATTACHMENT_TYPES.photo, ATTACHMENT_TYPES.audio].includes(attachment)
        ) {
          form.setFieldValue(fields.date, new Date(), true);
        }
        loadingFile(false, data);
      });
    }
  };

  const fieldDisabled = () => file.loading || (value && !file?.data);

  return (
    <div className={css.attachment}>
      <label htmlFor={fields.attachment}>
        <div className={css.buttonWrapper}>
          {!file.data && (
            <ActionButton
              text={i18n.t("fields.file_upload_box.select_file_button_text")}
              type={ACTION_BUTTON_TYPES.default}
              pending={file.loading}
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
        <FastField
          render={({ form }) => {
            return (
              <input
                id={fields.attachment}
                name={fields.attachment}
                onChange={event => handleChange(form, event)}
                disabled={fieldDisabled()}
                type="file"
              />
            );
          }}
        />
      </div>
      {renderPreview(attachment, file, css)}
    </div>
  );
};

AttachmentInput.displayName = "AttachmentInput";

AttachmentInput.propTypes = {
  attachment: PropTypes.string.isRequired,
  fields: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

export default AttachmentInput;
