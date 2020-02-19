import React, { useState } from "react";
import PropTypes from "prop-types";
import { FastField } from "formik";
import { Button, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { useI18n } from "../../../../i18n";
import { toBase64 } from "../../../../../libs/base64";
import styles from "../../styles.css";

import { ATTACHMENT_TYPES } from "./constants";

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

  const renderPreview = () => {
    const { data, fileName } = file;

    return data && attachment === ATTACHMENT_TYPES.photo ? (
      <img src={data} alt="" className={css.preview} />
    ) : (
      <div>{fileName}</div>
    );
  };

  const fieldDisabled = () => file.loading || (value && !file?.data);

  return (
    <div className={css.attachment}>
      <label htmlFor={fields.attachment}>
        <div className={css.buttonWrapper}>
          <Button
            variant="outlined"
            color="primary"
            component="span"
            disabled={fieldDisabled()}
          >
            {i18n.t("fields.file_upload_box.select_file_button_text")}
            {file.loading && (
              <CircularProgress size={24} className={css.buttonProgress} />
            )}
          </Button>
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
      {renderPreview()}
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
