// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useState } from "react";
import PropTypes from "prop-types";
import { InputLabel, FormHelperText } from "@mui/material";
import { cx } from "@emotion/css";
import GetAppIcon from "@mui/icons-material/GetApp";

import { toBase64 } from "../../../libs";
import { PHOTO_FIELD, DOCUMENT_FIELD, EMPTY_VALUE } from "../constants";
import ActionButton from "../../action-button";
import { ACTION_BUTTON_TYPES } from "../../action-button/constants";
import { ATTACHMENT_TYPES } from "../../record-form/form/field-types/attachments/constants";
import { AssetJwt } from "../../asset-jwt";

import css from "./styles.css";

function AttachmentInput({ commonInputProps, metaInputProps, formMode, formMethods }) {
  const { setValue, watch, register } = formMethods;

  const [file, setFile] = useState({
    loading: false,
    data: null,
    fileName: ""
  });
  const isShow = formMode.get("isShow");

  const { type, fileFormat, renderDownloadButton, downloadButtonLabel } = metaInputProps;
  const { name, label, disabled, helperText, error } = commonInputProps;

  const attachment = type === DOCUMENT_FIELD ? ATTACHMENT_TYPES.document : type;
  const isDocument = attachment === ATTACHMENT_TYPES.document;
  const acceptedTypes = fileFormat || (isDocument ? ".csv" : "*");

  const fileBase64 = watch(`${name}_base64`);
  const fileUrl = watch(`${name}_url`);

  const loadingFile = (loading, data) => {
    setFile({
      loading,
      data: `${data?.content}${data?.result}`,
      fileName: data?.fileName
    });
  };
  const handleChange = async event => {
    const files = event?.target?.files;
    const selectedFile = files?.[0];

    if (selectedFile) {
      loadingFile(true);
      const data = await toBase64(selectedFile, attachment);

      if (data) {
        setValue(`${name}_base64`, data.result, { shouldDirty: true });
        setValue(`${name}_file_name`, data.fileName, { shouldDirty: true });
        loadingFile(false, data);
      }
    }
  };

  const fieldDisabled = () => file.loading || Boolean(fileBase64 && !file?.data);

  // eslint-disable-next-line react/no-multi-comp, react/display-name
  const renderPreview = () => {
    const { data, fileName } = file;

    return (data || fileUrl) && type === PHOTO_FIELD ? (
      <div>
        <AssetJwt src={data || fileUrl} alt="Image" className={css.preview} />
      </div>
    ) : (
      <span>{fileName}</span>
    );
  };

  // eslint-disable-next-line react/no-multi-comp, react/display-name
  const renderButton = () => {
    return disabled ? null : (
      <div className={css.buttonWrapper}>
        <ActionButton
          id={`${name}-select-file`}
          text="fields.file_upload_box.select_file_button_text"
          type={ACTION_BUTTON_TYPES.default}
          pending={file.loading}
          rest={{
            component: "span",
            variant: "outlined",
            disabled: disabled || fieldDisabled()
          }}
        />
      </div>
    );
  };
  const handleDownloadFile = () => {
    window.open(fileUrl);
  };

  const downloadFile = fileUrl ? (
    <ActionButton
      id={`${name}-download-file`}
      icon={<GetAppIcon />}
      text={downloadButtonLabel}
      type={ACTION_BUTTON_TYPES.default}
      noTranslate
      rest={{
        onClick: handleDownloadFile
      }}
    />
  ) : (
    EMPTY_VALUE
  );

  const downloadButton = renderDownloadButton && isShow && downloadFile;

  const classes = cx(css.attachment, { [css.document]: isDocument && (!renderDownloadButton || !isShow) });

  return (
    <div className={classes}>
      <label htmlFor={name}>
        <InputLabel>{label}</InputLabel>
        <FormHelperText error={error}>{helperText}</FormHelperText>
        {renderButton()}
      </label>
      <div className={css.inputField}>
        <input
          type="file"
          id={name}
          name={name}
          onChange={handleChange}
          disabled={disabled || fieldDisabled()}
          accept={acceptedTypes}
        />
        <input type="hidden" name={`${name}_base64`} ref={register} />
        <input type="hidden" name={`${name}_file_name`} ref={register} />
        <input type="hidden" name={`${name}_url`} ref={register} />
      </div>
      {!renderDownloadButton && renderPreview()}
      <div className={css.downloadButton}>{downloadButton}</div>
    </div>
  );
}

AttachmentInput.displayName = "AttachmentInput";

AttachmentInput.propTypes = {
  commonInputProps: PropTypes.object,
  formMethods: PropTypes.object.isRequired,
  formMode: PropTypes.object,
  metaInputProps: PropTypes.object
};

export default AttachmentInput;
