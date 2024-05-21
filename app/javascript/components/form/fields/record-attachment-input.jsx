// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { useFieldArray } from "react-hook-form";

import { reduceMapToObject } from "../../../libs/component-helpers";
import PhotoArray from "../../record-form/form/field-types/attachments/photo-array";
import AttachmentLabel from "../../record-form/form/field-types/attachments/attachment-label";
import { PHOTO_RECORD_FIELD } from "../constants";

import AudioArray from "./audio-array";

const AttachmentInputArray = ({ commonInputProps, metaInputProps, formMode, formMethods }) => {
  const arrayMethods = useFieldArray({
    control: formMethods.control,
    name: commonInputProps.name
  });

  const urls = arrayMethods.fields.map(field => field.attachment_url);

  const { label, helperText } = commonInputProps;
  const mode = reduceMapToObject(formMode);

  const AttachmentArray = metaInputProps.type === PHOTO_RECORD_FIELD ? PhotoArray : AudioArray;

  const handleAttachmentAddition = () => {};

  return (
    <div>
      <AttachmentLabel
        label={label}
        mode={mode}
        helpText={helperText}
        handleAttachmentAddition={handleAttachmentAddition}
        arrayHelpers={arrayMethods}
        disabled={mode.isShow}
      />
      <AttachmentArray images={urls} attachments={arrayMethods.fields} />
    </div>
  );
};

AttachmentInputArray.displayName = "AttachmentInputArray";

AttachmentInputArray.propTypes = {
  commonInputProps: PropTypes.object,
  formMethods: PropTypes.object.isRequired,
  formMode: PropTypes.object,
  metaInputProps: PropTypes.object
};

export default AttachmentInputArray;
