import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";

import { useI18n } from "../../i18n";
import TextInput from "../fields/text-input";
import SwitchInput from "../fields/switch-input";
import SelectInput from "../fields/select-input";
import {
  TEXT_FIELD,
  TEXT_AREA,
  TICK_FIELD,
  CHECK_BOX_FIELD,
  SELECT_FIELD
} from "../constants";
import CheckboxInput from "../fields/checkbox-input";

const FormSectionField = ({ field }) => {
  const { type, hideOnShow } = field;
  const i18n = useI18n();
  const { formMode } = useFormContext();

  const commonInputProps = {
    label: i18n.getI18nStringFromObject(field.display_name),
    helperText: i18n.getI18nStringFromObject(field.help_text),
    fullWidth: true,
    autoComplete: "new-password",
    InputLabelProps: {
      shrink: true
    },
    disabled: formMode.get("isShow")
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
      case SELECT_FIELD:
        return SelectInput;
      default:
        return TextInput;
    }
  })(type);

  return (
    (hideOnShow && formMode.get("isShow")) || (
      <Field field={field} commonInputProps={commonInputProps} />
    )
  );
};

FormSectionField.displayName = "FormSectionField";

FormSectionField.propTypes = {
  field: PropTypes.object.isRequired
};

export default FormSectionField;
