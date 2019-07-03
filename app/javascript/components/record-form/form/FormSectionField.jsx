/* eslint-disable import/no-cycle */

import React from "react";
import PropTypes from "prop-types";
import SubformField from "./SubformField";
import DateField from "./DateField";
import SelectField from "./SelectField";
import TextField from "./TextField";
import TickField from "./TickField";
import Seperator from "./Seperator";
import RadioField from "./RadioField";
import AttachmentField from "./AttachmentField";
import * as C from "../constants";

const FormSectionField = ({ field, values, index, form, mode }) => {
  const {
    display_name: displayName,
    help_text: helpText,
    name,
    type,
    disabled,
    editable,
    visible
  } = field;

  const fieldName = index >= 0 ? `${form.id}[${index}][${name}]` : name;

  const fieldProps = {
    name: fieldName,
    multiline: type === "textarea",
    fullWidth: true,
    InputProps: {
      readOnly: mode.isShow
    },
    InputLabelProps: {
      shrink: true
    },
    helperText: helpText ? helpText.en : "",
    autoComplete: "off",
    label: displayName.en,
    value: values[fieldName],
    disabled: mode.isShow || disabled || !editable
  };

  if (visible) {
    switch (type) {
      case C.SUBFORM_SECTION:
        return <SubformField {...{ field, values, mode }} />;
      case C.DATE_FIELD:
        return <DateField {...fieldProps} />;
      case C.SELECT_FIELD:
        return (
          <SelectField
            {...fieldProps}
            option={field.option_strings_source}
            multiple={field.multi_select}
          />
        );
      case C.NUMERIC_FIELD:
        return <TextField {...fieldProps} type="number" />;
      case C.TICK_FIELD:
        return <TickField {...fieldProps} />;
      case C.RADIO_FIELD:
        return <RadioField {...fieldProps} />;
      case C.SEPERATOR:
        return <Seperator {...fieldProps} />;
      case C.PHOTO_FIELD:
        return (
          <AttachmentField {...fieldProps} attachment="photo" values={values} />
        );
      case C.AUDIO_FIELD:
        return (
          <AttachmentField {...fieldProps} attachment="audio" values={values} />
        );
      case C.DOCUMENT_FIELD:
        return (
          <AttachmentField
            {...fieldProps}
            attachment="document"
            values={values}
          />
        );
      default:
        return <TextField {...fieldProps} />;
    }
  }

  return null;
};

FormSectionField.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object,
  values: PropTypes.object,
  index: PropTypes.number,
  mode: PropTypes.object
};

export default FormSectionField;
