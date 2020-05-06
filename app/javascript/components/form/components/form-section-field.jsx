import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import get from "lodash/get";

import { useI18n } from "../../i18n";
import TextInput from "../fields/text-input";
import SwitchInput from "../fields/switch-input";
import SelectInput from "../fields/select-input";
import ErrorField from "../fields/error-field";
import {
  CHECK_BOX_FIELD,
  ERROR_FIELD,
  LABEL_FIELD,
  PHOTO_FIELD,
  SELECT_FIELD,
  TICK_FIELD
} from "../constants";
import CheckboxInput from "../fields/checkbox-input";
import AttachmentInput from "../fields/attachment-input";
import Label from "../fields/label";
import { getOptions } from "../selectors";

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
    groupBy,
    password,
    multi_select: multiSelect,
    editable,
    watchedInputs,
    handleWatchedInputs,
    inlineCheckboxes,
    freeSolo,
    check_errors: fieldCheckErrors,
    disabled
  } = field;
  const i18n = useI18n();
  const { formMode, errors, watch } = useFormContext();
  const error = errors ? get(errors, name) : undefined;

  const errorsToCheck = checkErrors
    ? checkErrors.concat(fieldCheckErrors)
    : fieldCheckErrors;

  const optionSource = useSelector(
    state =>
      getOptions(
        state,
        optionStringsSource,
        i18n.locale,
        options || optionsStringsText
      ),
    (prev, next) => prev.equals(next)
  );

  const watchedInputsValues = watchedInputs ? watch(watchedInputs) : null;
  const watchedInputProps = handleWatchedInputs
    ? handleWatchedInputs(watchedInputsValues, name, { error })
    : {};

  const renderError = () =>
    checkErrors?.size && errors
      ? Object.keys(errors).some(
          errorKey => checkErrors.includes(errorKey) && name.includes(errorKey)
        )
      : false;

  const commonInputProps = {
    name,
    disabled:
      typeof disabled === "boolean"
        ? disabled
        : formMode.get("isShow") || (formMode.get("isEdit") && !editable),
    required,
    autoFocus,
    error: typeof error !== "undefined" || renderError(),
    label: i18n.getI18nStringFromObject(displayName),
    helperText: error?.message || i18n.getI18nStringFromObject(helpText),
    fullWidth: true,
    autoComplete: "new-password",
    InputLabelProps: {
      shrink: true
    },
    ...watchedInputProps
  };

  const metaInputProps = {
    type,
    password,
    multiSelect,
    inlineCheckboxes,
    freeSolo,
    groupBy
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
      case LABEL_FIELD:
        return Label;
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
          options={optionSource.toJS()}
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
