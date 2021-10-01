import { forwardRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { TextField, CircularProgress } from "@material-ui/core";

import { useI18n } from "../../i18n";

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
      currentOptionLabel,
      error
    },
    ref
  ) => {
    const i18n = useI18n();
    const [prevLabel, setPrevLabel] = useState();
    const [inputValueChanged, setInputValueChanged] = useState(false);

    const { InputProps, ...restTextFieldProps } = TextFieldProps;
    const disabledPlaceholder = mode?.isShow && !value ? "--" : "";

    const inputParams = {
      ...params,
      ...(inputValueChanged ? {} : { inputProps: { ...params.inputProps, value: currentOptionLabel } }),
      fullWidth: true,
      helperText: error || helperText,
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
      inputParams.inputProps.ref.current.value = currentOptionLabel;
      inputParams.inputProps.value = currentOptionLabel;

      setInputValueChanged(false);
    }, [currentOptionLabel]);

    useEffect(() => {
      if (
        !inputValueChanged &&
        params.inputProps.value !== prevLabel &&
        params.inputProps.value !== currentOptionLabel
      ) {
        setInputValueChanged(true);
      }
    }, [params.inputProps.value]);

    useEffect(() => {
      setPrevLabel(currentOptionLabel);
    }, []);

    return <TextField {...restInputParams} error={!!error} inputRef={ref} />;
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
