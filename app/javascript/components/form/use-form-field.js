import get from "lodash/get";
import { useMemo } from "react";

import { useI18n } from "../i18n";
import { DATE_FORMAT, DATE_TIME_FORMAT } from "../../config";

import { notVisible } from "./utils";
import ErrorField from "./fields/error-field";
import RadioField from "./fields/radio-input";
import ToggleField from "./fields/toggle-input";
import DateField from "./fields/date-input";
import Seperator from "./fields/seperator";
import OrderableOptionsField from "./fields/orderable-options-field";
import DialogTrigger from "./fields/dialog-trigger";
import HiddenInput from "./fields/hidden-input";
import LinkField from "./fields/link-field";
import SelectInput from "./fields/select-input";
import SwitchInput from "./fields/switch-input";
import TextInput from "./fields/text-input";
import CheckboxInput from "./fields/checkbox-input";
import AttachmentInput from "./fields/attachment-input";
import Label from "./fields/label";
import {
  CHECK_BOX_FIELD,
  ERROR_FIELD,
  LABEL_FIELD,
  ORDERABLE_OPTIONS_FIELD,
  PHOTO_FIELD,
  SELECT_FIELD,
  TICK_FIELD,
  RADIO_FIELD,
  TOGGLE_FIELD,
  DATE_FIELD,
  SEPARATOR,
  DIALOG_TRIGGER,
  HIDDEN_FIELD,
  DOCUMENT_FIELD,
  LINK_FIELD
} from "./constants";

export default (field, { checkErrors, errors, formMode, disableUnderline }) => {
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
    showIf,
    inlineCheckboxes,
    freeSolo,
    check_errors: fieldCheckErrors,
    hint,
    disabled,
    inputClassname,
    date_include_time: dateIncludeTime,
    selected_value: selectedValue,
    visible,
    groupBy,
    tooltip,
    numeric,
    onChange,
    disableClearable,
    onBlur,
    asyncOptions,
    asyncAction,
    asyncParams,
    asyncParamsFromWatched,
    asyncOptionsLoadingPath,
    clearDependentValues,
    clearDependentReason,
    option_strings_source_id_key: optionStringsSourceIdKey,
    setOtherFieldValues,
    wrapWithComponent: WrapWithComponent,
    renderChildren,
    onClick,
    placeholder,
    maxSelectedOptions,
    onKeyPress,
    currRecord,
    href,
    fileFormat,
    filterOptionSource,
    forceShowIf,
    multipleLimitOne,
    rawOptions,
    renderDownloadButton,
    downloadButtonLabel,
    extraSelectorOptions
  } = field;

  const i18n = useI18n();
  const error = errors ? get(errors, name) : undefined;
  const errorsToCheck = checkErrors ? checkErrors.concat(fieldCheckErrors) : fieldCheckErrors;

  const optionSelector = watchedInputsValues => ({
    ...extraSelectorOptions,
    source: optionStringsSource,
    options: options || optionsStringsText,
    optionStringsSourceIdKey,
    currRecord,
    rawOptions,
    filterOptions: filterOptionSource && (optionsFromState => filterOptionSource(watchedInputsValues, optionsFromState))
  });

  const dateFormat = dateIncludeTime ? DATE_TIME_FORMAT : DATE_FORMAT;

  const renderError = () =>
    checkErrors?.size && errors
      ? Object.keys(errors).some(errorKey => checkErrors.includes(errorKey) && name.includes(errorKey))
      : false;

  const handleVisibility = watchedInputsValues => {
    if ((showIf && !formMode.get("isShow")) || forceShowIf) {
      return !showIf(watchedInputsValues);
    }

    return hideOnShow && formMode.get("isShow");
  };

  const inputDisabled =
    formMode.get("isShow") || (typeof disabled === "boolean" ? disabled : formMode.get("isEdit") && !editable);
  const inputError = typeof error !== "undefined" || renderError();
  const inputHelperTxt = error?.message || i18n.getI18nStringFromObject(helpText);
  const inputLabel = i18n.getI18nStringFromObject(displayName);

  const commonInputProps = {
    InputLabelProps: { shrink: true },
    autoComplete: "off",
    autoFocus,
    className: inputClassname,
    disabled: inputDisabled,
    error: inputError,
    format: dateFormat,
    fullWidth: true,
    helperText: inputHelperTxt,
    label: inputLabel,
    name,
    placeholder,
    required,
    ...(disableUnderline && { InputProps: { disableUnderline } })
  };

  const metaInputProps = {
    asyncAction,
    asyncOptions,
    asyncOptionsLoadingPath,
    asyncParams,
    asyncParamsFromWatched,
    clearDependentValues,
    clearDependentReason,
    disableClearable,
    fileFormat,
    freeSolo,
    groupBy,
    hint,
    href,
    inlineCheckboxes,
    maxSelectedOptions,
    multiSelect,
    numeric,
    onBlur,
    onChange,
    onClick,
    onKeyPress,
    password,
    selectedValue,
    setOtherFieldValues,
    tooltip,
    type,
    multipleLimitOne,
    renderDownloadButton,
    downloadButtonLabel
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
      case DOCUMENT_FIELD:
        return AttachmentInput;
      case LABEL_FIELD:
        return Label;
      case ERROR_FIELD:
        return ErrorField;
      case RADIO_FIELD:
        return RadioField;
      case TOGGLE_FIELD:
        return ToggleField;
      case DATE_FIELD:
        return DateField;
      case ORDERABLE_OPTIONS_FIELD:
        return OrderableOptionsField;
      case SEPARATOR:
        return Seperator;
      case DIALOG_TRIGGER:
        return DialogTrigger;
      case HIDDEN_FIELD:
        return HiddenInput;
      case LINK_FIELD:
        return LinkField;
      default:
        return TextInput;
    }
  })(type);

  const isNotVisible = watchedInputProps => notVisible(visible) || notVisible(watchedInputProps?.visible);

  const obj = useMemo(() => ({
    Field,
    WrapWithComponent,
    commonInputProps,
    errorsToCheck,
    error,
    handleVisibility,
    renderChildren,
    metaInputProps,
    optionSelector,
    isNotVisible
  }));

  return obj;
};
