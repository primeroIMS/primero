import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";

import { useI18n } from "../../i18n";
import TextInput from "../fields/text-input";
import SwitchInput from "../fields/switch-input";
import SelectInput from "../fields/select-input";
import { TICK_FIELD, CHECK_BOX_FIELD, SELECT_FIELD } from "../constants";
import CheckboxInput from "../fields/checkbox-input";
import { whichOptions } from "../utils";
import { getOption } from "../../record-form";

const FormSectionField = ({ field }) => {
  const {
    type,
    hideOnShow,
    required,
    name,
    display_name: displayName,
    help_text: helpText,
    autoFocus,
    option_strings_source: optionStringsSource,
    option_strings_text: optionsStringsText,
    options,
    password,
    multi_select: multiSelect,
    editable,
    watchInput,
    hideIfWatch,
    helpTextIfWatch
  } = field;
  const i18n = useI18n();
  const { formMode, errors } = useFormContext();
  const error = errors[name];

  const lookups = useSelector(
    state => getOption(state, optionStringsSource, i18n.locale),
    !isEmpty(optionStringsSource)
  );

  const inputOptions = whichOptions({
    optionStringsSource,
    lookups,
    options: options || optionsStringsText,
    i18n
  });

  const commonInputProps = {
    name,
    required,
    autoFocus,
    error: typeof error !== "undefined",
    label: i18n.getI18nStringFromObject(displayName),
    helperText: error?.message || i18n.getI18nStringFromObject(helpText),
    fullWidth: true,
    autoComplete: "new-password",
    InputLabelProps: {
      shrink: true
    },
    disabled: formMode.get("isShow") || (formMode.get("isEdit") && !editable)
  };

  const metaInputProps = {
    type,
    password,
    multiSelect,
    watchInput,
    hideIfWatch,
    helpTextIfWatch
  };

  const Field = (fieldType => {
    switch (fieldType) {
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
    <div>
      {(hideOnShow && formMode.get("isShow")) || (
        <Field
          field={field}
          commonInputProps={commonInputProps}
          metaInputProps={metaInputProps}
          options={inputOptions}
        />
      )}
    </div>
  );
};

FormSectionField.displayName = "FormSectionField";

FormSectionField.propTypes = {
  field: PropTypes.object.isRequired
};

export default FormSectionField;
