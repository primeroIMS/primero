/* eslint-disable jsx-a11y/media-has-caption, jsx-a11y/label-has-for */

import React, { useState } from "react";
import PropTypes from "prop-types";
import { FieldArray, connect, getIn } from "formik";
import { Box } from "@material-ui/core";

import { useI18n } from "../../../../i18n";
import { ATTACHMENT_FIELD_NAME } from "../../constants";
import { PHOTO_FIELD, AUDIO_FIELD } from "../../../constants";

import {
  ATTACHMENT_FIELDS_INITIAL_VALUES,
  ATTACHMENT_TYPES,
  FIELD_ATTACHMENT_TYPES
} from "./constants";
import AttachmentLabel from "./attachment-label";
import DocumentField from "./document-field";
import AttachmentField from "./attachment-field";
import PhotoArray from "./photo-array";

// TODO: No link to display / download upload
const Component = ({ name, field, label, disabled, formik, mode }) => {
  const i18n = useI18n();
  const values = getIn(formik.values, name);
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

  const valuesSize = values.length;

  const renderAttachmentInputFields = arrayHelpers =>
    values.length > 0 &&
    values.map((value, index) => {
      return (
        // eslint-disable-next-line react/no-array-index-key
        <div key={`${attachment}-${index}`}>
          {attachment === ATTACHMENT_TYPES.document ? (
            <DocumentField
              title={`${mode.isShow ? "" : i18n.t("fields.add")} ${label}`}
              index={index}
              name={name}
              mode={mode}
              open={valuesSize === index + 1 && openLastDialog}
              resetOpenLastDialog={resetOpenLastDialog}
              value={value}
              removeFunc={arrayHelpers.remove}
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
    values.map(value => {
      const { attachment_url: attachmentUrl } = value;

      return (
        <Box my={2}>
          <audio controls>
            <source src={attachmentUrl} />
          </audio>
        </Box>
      );
    });

  const renderField = arrayHelpers => {
    if (field.type === PHOTO_FIELD && mode.isShow) {
      return <PhotoArray images={values.map(value => value.attachment_url)} />;
    }

    if (field.type === AUDIO_FIELD && mode.isShow) {
      return audioAttachments();
    }

    return renderAttachmentInputFields(arrayHelpers);
  };

  return (
    <FieldArray
      name={name}
      render={arrayHelpers => (
        <div>
          <AttachmentLabel
            label={label}
            mode={mode}
            handleAttachmentAddition={handleAttachmentAddition}
            arrayHelpers={arrayHelpers}
            disabled={disabled}
          />

          {renderField(arrayHelpers)}
        </div>
      )}
    />
  );
};

Component.displayName = ATTACHMENT_FIELD_NAME;

Component.propTypes = {
  disabled: PropTypes.bool,
  field: PropTypes.object,
  formik: PropTypes.object,
  label: PropTypes.string,
  mode: PropTypes.object,
  name: PropTypes.string
};

export default connect(Component);
