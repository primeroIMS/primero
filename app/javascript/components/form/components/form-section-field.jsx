import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";

import { useI18n } from "../../i18n";
import { getLocations, getOption } from "../../record-form";
import TextInput from "../fields/text-input";
import SwitchInput from "../fields/switch-input";
import SelectInput from "../fields/select-input";
import {
  TICK_FIELD,
  CHECK_BOX_FIELD,
  SELECT_FIELD,
  PHOTO_FIELD
} from "../constants";
import CheckboxInput from "../fields/checkbox-input";
import AttachmentInput from "../fields/attachment-input";
import { whichOptions } from "../utils";
import { selectAgencies } from "../../application";

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
    helpTextIfWatch,
    watchDisableInput,
    watchDisable
  } = field;
  const i18n = useI18n();
  const { formMode, errors } = useFormContext();
  const error = errors[name];

  const lookups = useSelector(
    state => getOption(state, optionStringsSource, i18n.locale),
    !isEmpty(optionStringsSource)
  );

  const agencies = useSelector(state =>
    selectAgencies(state, optionStringsSource === "Agency")
  );

  const locations = useSelector(state =>
    getLocations(state, optionStringsSource === "Location")
  );

  const inputOptions = whichOptions({
    optionStringsSource,
    lookups,
    agencies,
    locations,
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
    helpTextIfWatch,
    watchDisableInput,
    watchDisable
  };

  const Field = (fieldType => {
    switch (fieldType) {
      case TICK_FIELD:
        return SwitchInput;
      case CHECK_BOX_FIELD:
        return CheckboxInput;
      case SELECT_FIELD:
        return SelectInput;
      case PHOTO_FIELD:
        return AttachmentInput;
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
