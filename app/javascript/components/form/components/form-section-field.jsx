import React from "react";
import PropTypes from "prop-types";

import { useI18n } from "../../i18n";
import TextInput from "../fields/text-input";
import SwitchInput from "../fields/switch-input";
import {
  TEXT_FIELD,
  TEXT_AREA,
  TICK_FIELD,
  CHECK_BOX_FIELD
} from "../constants";
import CheckboxInput from "../fields/checkbox-input";

const FormSectionField = ({ field }) => {
  const { type } = field;
  const i18n = useI18n();

  const commonInputProps = {
    label: i18n.getI18nStringFromObject(field.display_name),
    helperText: i18n.getI18nStringFromObject(field.help_text),
    fullWidth: true,
    autoComplete: "off",
    InputLabelProps: {
      shrink: true
    }
  };

  const Field = (fieldType => {
    switch (fieldType) {
      case TEXT_FIELD:
      case TEXT_AREA:
        return TextInput;
      case TICK_FIELD:
        return SwitchInput;
      case CHECK_BOX_FIELD:
        return CheckboxInput;
      default:
        return TextInput;
    }
  })(type);

  return <Field field={field} commonInputProps={commonInputProps} />;
};

FormSectionField.displayName = "FormSectionField";

FormSectionField.propTypes = {
  field: PropTypes.object.isRequired
};

export default FormSectionField;
