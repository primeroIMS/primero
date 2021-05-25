import { forwardRef, useEffect } from "react";
import PropTypes from "prop-types";
import { TextField, CircularProgress } from "@material-ui/core";

import { useI18n } from "../../i18n";
import { optionLabel } from "../utils";

const Component = forwardRef(
  (
    {
      params,
      value,
      mode,
      helperText,
      InputLabelProps,
      isDisabled,
      isLoading,
      multiple,
      TextFieldProps,
      options,
      optionIdKey,
      optionLabelKey
    },
    ref
  ) => {
    const i18n = useI18n();

    const { InputProps, ...restTextFieldProps } = TextFieldProps;
    const disabledPlaceholder = mode?.isShow && !value ? "--" : "";

    const inputParams = {
      ...params,
      fullWidth: true,
      helperText,
      InputLabelProps,
      placeholder: isDisabled ? disabledPlaceholder : i18n.t(`fields.select_${multiple ? "multiple" : "single"}`),
      ...InputProps,
      ...restTextFieldProps,
      InputProps: {
        ...params.InputProps,
        endAdornment: (
          <>
            {isLoading && <CircularProgress color="inherit" size={20} />}
            {mode?.isShow || params.InputProps.endAdornment}
          </>
        )
      }
    };

    const { disableUnderline, ...restInputParams } = inputParams;

    useEffect(() => {
      inputParams.inputProps.ref.current.value = optionLabel(value || "", options, optionIdKey, optionLabelKey);
    }, [i18n.locale]);

    return <TextField {...restInputParams} inputRef={ref} />;
  }
);

Component.displayName = "AutoCompleteInput";

Component.defaultProps = {
  helperText: "",
  InputLabelProps: {},
  isDisabled: false,
  isLoading: false,
  mode: {},
  multiple: false,
  optionIdKey: "value",
  optionLabelKey: "label",
  options: [],
  params: {},
  TextFieldProps: {},
  value: ""
};

Component.propTypes = {
  helperText: PropTypes.string,
  InputLabelProps: PropTypes.object,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  mode: PropTypes.object,
  multiple: PropTypes.bool,
  optionIdKey: PropTypes.string,
  optionLabelKey: PropTypes.string,
  options: PropTypes.array,
  params: PropTypes.object,
  TextFieldProps: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};

export default Component;
