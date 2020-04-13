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
import ErrorField from "../fields/error-field";
import {
  CHECK_BOX_FIELD,
  ERROR_FIELD,
  PHOTO_FIELD,
  SELECT_FIELD,
  TICK_FIELD
} from "../constants";
import CheckboxInput from "../fields/checkbox-input";
import AttachmentInput from "../fields/attachment-input";
import { whichOptions } from "../utils";
import { selectAgencies } from "../../application";

const FormSectionField = ({ checkErrors, field }) => {
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
    check_errors: fieldCheckErrors,
    disabled,
    customClass
  } = field;
  const i18n = useI18n();
  const { formMode, errors } = useFormContext();
  const error = errors ? errors[name] : undefined;

  const errorsToCheck = checkErrors
    ? checkErrors.concat(fieldCheckErrors)
    : fieldCheckErrors;

  const lookups = useSelector(
    state => getOption(state, optionStringsSource, i18n.locale),
    !isEmpty(optionStringsSource)
  );

  const agencies = useSelector(
    state => selectAgencies(state),
    (agencies1, agencies2) => agencies1.equals(agencies2)
  );

  const locations = useSelector(
    state => getLocations(state),
    (locations1, locations2) => locations1.equals(locations2)
  );

  const inputOptions = whichOptions({
    optionStringsSource,
    lookups,
    agencies,
    locations,
    options: options || optionsStringsText,
    i18n
  });

  const renderError = () =>
    checkErrors?.size && errors
      ? Object.keys(errors).some(
          errorKey => checkErrors.includes(errorKey) && name.includes(errorKey)
        )
      : false;

  const commonInputProps = {
    name,
    required,
    autoFocus,
    error: typeof error !== "undefined" || renderError(),
    label: i18n.getI18nStringFromObject(displayName),
    helperText: error?.message || i18n.getI18nStringFromObject(helpText),
    fullWidth: true,
    autoComplete: "off",
    InputLabelProps: {
      shrink: true
    },
    disabled:
      typeof disabled === "boolean"
        ? disabled
        : formMode.get("isShow") || (formMode.get("isEdit") && !editable),
    customClass
  };

  const metaInputProps = {
    type,
    password,
    multiSelect
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
      case ERROR_FIELD:
        return ErrorField;
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
          errorsToCheck={errorsToCheck}
        />
      )}
    </div>
  );
};

FormSectionField.displayName = "FormSectionField";

FormSectionField.propTypes = {
  checkErrors: PropTypes.object,
  field: PropTypes.object.isRequired
};

export default FormSectionField;
