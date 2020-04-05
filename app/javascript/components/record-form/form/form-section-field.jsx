import React, { memo } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";

import { useI18n } from "../../i18n";
import {
  DATE_FIELD,
  SELECT_FIELD,
  TICK_FIELD,
  RADIO_FIELD,
  SEPERATOR,
  PHOTO_FIELD,
  AUDIO_FIELD,
  DOCUMENT_FIELD
} from "../constants";

import { FORM_SECTION_FIELD_NAME } from "./constants";
import DateField from "./field-types/date-field";
import SelectField from "./field-types/select-field";
import TextField from "./field-types/text-field";
import TickField from "./field-types/tick-field";
import Seperator from "./field-types/seperator";
import RadioField from "./field-types/radio-field";
import AttachmentField from "./field-types/attachments";
import styles from "./styles.css";

const FormSectionField = ({
  name,
  field,
  mode,
  recordType,
  recordID,
  filters,
  index
}) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  const {
    type,
    help_text: helpText,
    display_name: displayName,
    disabled,
    required,
    selected_value: selectedValue,
    hide_on_view_page: hideOnViewPage,
    visible
  } = field;

  const fieldProps = {
    name,
    field,
    recordType,
    recordID,
    filters,
    autoComplete: "off",
    fullWidth: true,
    InputProps: {
      readOnly: mode.isShow,
      classes: {
        root: css.input
      },
      autoComplete: "new-password"
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
    disabled: mode.isShow || disabled,
    checked: ["t", "true"].includes(selectedValue),
    index
  };

  const FieldComponent = (t => {
    switch (t) {
      case DATE_FIELD:
        return DateField;
      case SELECT_FIELD:
        return SelectField;
      case TICK_FIELD:
        return TickField;
      case RADIO_FIELD:
        return RadioField;
      case SEPERATOR:
        return Seperator;
      case PHOTO_FIELD:
      case AUDIO_FIELD:
      case DOCUMENT_FIELD:
        return AttachmentField;
      default:
        return TextField;
    }
  })(type);

  if ((mode?.isShow && hideOnViewPage) || !visible) return false;

  return <FieldComponent {...fieldProps} mode={mode} />;
};

FormSectionField.displayName = FORM_SECTION_FIELD_NAME;

FormSectionField.propTypes = {
  field: PropTypes.object.isRequired,
  filters: PropTypes.object,
  index: PropTypes.number,
  mode: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  recordID: PropTypes.string,
  recordType: PropTypes.string
};

export default memo(FormSectionField);
