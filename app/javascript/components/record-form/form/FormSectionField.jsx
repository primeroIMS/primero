import React, { memo } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { useI18n } from "components/i18n";
import DateField from "./DateField";
import SelectField from "./SelectField";
import TextField from "./TextField";
import TickField from "./TickField";
import Seperator from "./Seperator";
import RadioField from "./RadioField";
import AttachmentField from "./AttachmentField";
import * as C from "../constants";
import styles from "./styles.css";

const FormSectionField = ({ name, field, mode }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  const {
    type,
    help_text: helpText,
    display_name: displayName,
    disabled,
    editable,
    required
  } = field;

  const fieldProps = {
    name,
    field,
    autoComplete: "off",
    fullWidth: true,
    InputProps: {
      readOnly: mode.isShow,
      classes: {
        root: css.input
      }
    },
    InputLabelProps: {
      shrink: true,
      required,
      classes: {
        root: css.inputLabel
      }
    },
    label: displayName[i18n.locale],
    helperText: helpText ? helpText[i18n.locale] : "",
    disabled: mode.isShow || disabled || !editable
  };

  const FieldComponent = (t => {
    switch (t) {
      case C.DATE_FIELD:
        return DateField;
      case C.SELECT_FIELD:
        return SelectField;
      case C.TICK_FIELD:
        return TickField;
      case C.RADIO_FIELD:
        return RadioField;
      case C.SEPERATOR:
        return Seperator;
      case C.PHOTO_FIELD:
      case C.AUDIO_FIELD:
      case C.DOCUMENT_FIELD:
        return AttachmentField;
      default:
        return TextField;
    }
  })(type);

  return <FieldComponent {...fieldProps} mode={mode} />;
};

FormSectionField.propTypes = {
  name: PropTypes.string.isRequired,
  field: PropTypes.object.isRequired,
  mode: PropTypes.object.isRequired
};

export default memo(FormSectionField);
