/* eslint-disable import/no-cycle */

import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { useI18n } from "components/i18n";
import SubformField from "./SubformField";
import DateField from "./DateField";
import SelectField from "./SelectField";
import TextField from "./TextField";
import TickField from "./TickField";
import Seperator from "./Seperator";
import RadioField from "./RadioField";
import AttachmentField from "./AttachmentField";
import * as C from "../constants";
import styles from "./styles.css";

const FormSectionField = ({ field, values, index, mode, parentField }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  const {
    display_name: displayName,
    help_text: helpText,
    name,
    type,
    disabled,
    editable,
    visible
  } = field;

  const isNested = index >= 0;
  const fieldName = isNested ? `${parentField.name}[${index}].${name}` : name;
  const fieldValue = isNested
    ? values[parentField.name][index][name]
    : values[fieldName];

  const fieldProps = {
    name: fieldName,
    autoComplete: "off",
    label: displayName[i18n.locale],
    value: fieldValue,
    disabled: mode.isShow || disabled || !editable
  };

  const txtInputFieldProps = {
    ...fieldProps,
    fullWidth: true,
    InputProps: {
      readOnly: mode.isShow,
      classes: {
        root: css.input
      }
    },
    InputLabelProps: {
      shrink: true,
      classes: {
        root: css.inputLabel
      }
    },
    helperText: helpText ? helpText[i18n.locale] : ""
  };

  if (visible) {
    switch (type) {
      case C.SUBFORM_SECTION:
        return <SubformField {...{ field, values, mode }} />;
      case C.DATE_FIELD:
        return <DateField {...txtInputFieldProps} />;
      case C.SELECT_FIELD:
        return (
          <SelectField
            {...txtInputFieldProps}
            option={field.option_strings_source || field.option_strings_text}
            multiple={field.multi_select}
            mode={mode}
          />
        );
      case C.NUMERIC_FIELD:
        return <TextField {...txtInputFieldProps} type="number" />;
      case C.TICK_FIELD:
        return <TickField {...fieldProps} />;
      case C.RADIO_FIELD:
        return (
          <RadioField
            {...fieldProps}
            option={field.option_strings_source || field.option_strings_text}
          />
        );
      case C.SEPERATOR:
        return <Seperator {...fieldProps} />;
      case C.PHOTO_FIELD:
        return (
          <AttachmentField
            {...txtInputFieldProps}
            attachment="photo"
            values={values}
          />
        );
      case C.AUDIO_FIELD:
        return (
          <AttachmentField
            {...txtInputFieldProps}
            attachment="audio"
            values={values}
          />
        );
      case C.DOCUMENT_FIELD:
        return (
          <AttachmentField
            {...txtInputFieldProps}
            attachment="document"
            values={values}
          />
        );
      default:
        return (
          <TextField {...txtInputFieldProps} multiline={type === "textarea"} />
        );
    }
  }

  return null;
};

FormSectionField.propTypes = {
  field: PropTypes.object.isRequired,
  values: PropTypes.object,
  index: PropTypes.number,
  mode: PropTypes.object,
  parentField: PropTypes.object
};

export default FormSectionField;
