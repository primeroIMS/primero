// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable jsx-a11y/media-has-caption, jsx-a11y/label-has-for */

import { useState } from "react";
import PropTypes from "prop-types";
import { FieldArray, connect } from "formik";
import { Box } from "@mui/material";

import { useI18n } from "../../../../i18n";
import { ATTACHMENT_FIELD_NAME } from "../../constants";
import { PHOTO_FIELD, AUDIO_FIELD } from "../../../constants";
import LoadingIndicator from "../../../../loading-indicator";
import { getIsProcessingAttachments, getLoadingRecordState, getRecordAttachments } from "../../../../records";
import { useMemoizedSelector } from "../../../../../libs";
import { get } from "../../../../form/utils";
import SubformEmptyData from "../../subforms/subform-empty-data";
import { AssetJwt } from "../../../../asset-jwt";

import { ATTACHMENT_FIELDS_INITIAL_VALUES, ATTACHMENT_TYPES, FIELD_ATTACHMENT_TYPES } from "./constants";
import AttachmentLabel from "./attachment-label";
import DocumentField from "./document-field";
import AttachmentField from "./attachment-field";
import PhotoArray from "./photo-array";
import { buildBase64URL } from "./utils";
// TODO: No link to display / download upload
function Component({ name, field, label, disabled, formik, mode, recordType, helperText }) {
  const i18n = useI18n();

  const loading = useMemoizedSelector(state => getLoadingRecordState(state, recordType));
  const processing = useMemoizedSelector(state => getIsProcessingAttachments(state, recordType, name));
  const recordAttachments = useMemoizedSelector(state => getRecordAttachments(state, recordType));

  const values = get(formik.values, name, []);
  const error = get(formik.errors, name, "");
  const attachment = FIELD_ATTACHMENT_TYPES[field.type];

  const [openLastDialog, setOpenLastDialog] = useState(false);

  let initialAttachmentValue = ATTACHMENT_FIELDS_INITIAL_VALUES;

  const handleAttachmentAddition = arrayHelpers => {
    arrayHelpers.push(initialAttachmentValue);

    if (attachment === ATTACHMENT_TYPES.document) {
      setOpenLastDialog(true);
    }
  };

  const resetOpenLastDialog = () => {
    setOpenLastDialog(false);
  };

  if (attachment === ATTACHMENT_TYPES.document) {
    initialAttachmentValue = {
      ...initialAttachmentValue,
      document_description: "",
      date: null,
      comments: ""
    };
  }

  const renderAttachmentInputFields = arrayHelpers =>
    values?.length > 0 &&
    values?.map((value, index) => {
      return (
        <div key={`${attachment}-${name}`}>
          {attachment === ATTACHMENT_TYPES.document ? (
            <DocumentField
              title={`${mode.isShow ? "" : i18n.t("fields.add")} ${label}`}
              index={index}
              name={name}
              mode={mode}
              open={values?.length === index + 1 && openLastDialog}
              resetOpenLastDialog={resetOpenLastDialog}
              value={value}
              arrayHelpers={arrayHelpers}
              field={field}
              attachment={attachment}
            />
          ) : (
            <AttachmentField
              name={name}
              arrayHelpers={arrayHelpers}
              disabled={disabled}
              index={index}
              mode={mode}
              value={value}
              attachment={attachment}
            />
          )}
        </div>
      );
    });

  const audioAttachments = () =>
    values?.map(value => {
      const { attachment_url: attachmentUrl, file_name: fileName } = value;

      return (
        <Box my={2}>
          <AssetJwt
            id={fileName}
            src={attachmentUrl || buildBase64URL(value.content_type, value.attachment)}
            type="audio"
          />
        </Box>
      );
    });

  const renderField = arrayHelpers => {
    if (field.type === PHOTO_FIELD && mode.isShow) {
      const images = values?.map(value => value.attachment_url || buildBase64URL(value.content_type, value.attachment));

      return <PhotoArray images={images} data-testid="photo-array" />;
    }

    if (field.type === AUDIO_FIELD && mode.isShow) {
      return audioAttachments();
    }

    return renderAttachmentInputFields(arrayHelpers);
  };

  return (
    <FieldArray name={name} validateOnChange={false}>
      {arrayHelpers => (
        <div data-testid="field-array">
          <AttachmentLabel
            label={label}
            mode={mode}
            helpText={helperText}
            error={error}
            handleAttachmentAddition={handleAttachmentAddition}
            arrayHelpers={arrayHelpers}
            disabled={disabled}
          />
          <LoadingIndicator
            loading={Boolean(recordAttachments.size && (processing || loading))}
            hasData={!processing && !loading}
          >
            {values.length > 0 || <SubformEmptyData subformName={label} />}
            {renderField(arrayHelpers)}
          </LoadingIndicator>
        </div>
      )}
    </FieldArray>
  );
}

Component.displayName = ATTACHMENT_FIELD_NAME;

Component.propTypes = {
  disabled: PropTypes.bool,
  field: PropTypes.object,
  formik: PropTypes.object,
  helperText: PropTypes.string,
  label: PropTypes.string,
  mode: PropTypes.object,
  name: PropTypes.string,
  recordType: PropTypes.string
};

export default connect(Component);
