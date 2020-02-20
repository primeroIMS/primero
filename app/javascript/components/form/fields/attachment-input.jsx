import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, CircularProgress, InputLabel } from "@material-ui/core";
import { useFormContext } from "react-hook-form";
import { makeStyles } from "@material-ui/styles";

import { useI18n } from "../../i18n";
import { toBase64 } from "../../../libs/base64";
import { PHOTO_FIELD } from "../constants";

import styles from "./styles.css";

const AttachmentInput = ({ commonInputProps, metaInputProps }) => {
  const { setValue, getValues, watch, register } = useFormContext();
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const [file, setFile] = useState({
    loading: false,
    data: null,
    fileName: ""
  });

  const { type } = metaInputProps;
  const { name, label } = commonInputProps;

  const fileBase64 = watch(`${name}_base64`, "");
  const fileName = watch(`${name}_file_name`, "");

  const loadingFile = (loading, data) => {
    setFile({
      loading,
      data: `${data?.content}${data?.result}`,
      fileName: data?.name
    });
  };

  const handleChange = async event => {
    const files = event?.target?.files;
    const selectedFile = files?.[0];

    loadingFile(true);

    if (selectedFile) {
      toBase64(selectedFile).then(data => {
        setValue(`${name}_base64`, data.result);
        setValue(`${name}_file_name`, data.fileName);
        loadingFile(false, data);

        return data.result;
      });
    }
  };

  const fieldDisabled = () => file.loading || Boolean(fileBase64 && !file?.data);

  const renderPreview = () => {
    const { data, fileName } = file;

    return data && type === PHOTO_FIELD ? (
      <img src={data} alt="" className={css.preview} />
    ) : (
      <div>{fileName}</div>
    );
  };

  return (
    <div className={css.attachment}>
      <label htmlFor={name}>
        <InputLabel>{label}</InputLabel>
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
        <input
          type="file"
          id={name}
          name={name}
          onChange={handleChange}
          ref={register}
          disabled={fieldDisabled()}
        />
        <input
          type="hidden"
          name={`${name}_base64`}
          defaultValue={fileBase64}
          ref={register}
        />
        <input
          type="hidden"
          name={`${name}_file_name`}
          defaultValue={fileName}
          ref={register}
        />
      </div>
      {renderPreview()}
    </div>
  );
};

AttachmentInput.displayName = "AttachmentInput";

AttachmentInput.propTypes = {
  commonInputProps: PropTypes.object,
  metaInputProps: PropTypes.object
};

export default AttachmentInput;
