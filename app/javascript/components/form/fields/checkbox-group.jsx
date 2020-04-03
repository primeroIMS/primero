import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FormControlLabel, Checkbox } from "@material-ui/core";
import { useFormContext } from "react-hook-form";

import { useI18n } from "../../i18n";
import { optionText } from "../utils";

const CheckboxGroup = ({
  onChange,
  value,
  options,
  commonInputProps,
  metaInputProps
}) => {
  const i18n = useI18n();
  const { watch } = useFormContext();
  const [checked, setChecked] = useState([]);
  const { name, disabled } = commonInputProps;
  const { watchDisable, watchDisableInput } = metaInputProps;
  const watchedDisableField = watchDisableInput
    ? watch(watchDisableInput, "")
    : false;
  let disableField = disabled;

  if (
    !disabled &&
    watchDisableInput &&
    watchDisable &&
    watchedDisableField !== false
  ) {
    disableField = watchDisable(watchedDisableField);
  }

  const handleChange = e => {
    const { value: selectedValue } = e.target;

    const newState = checked.includes(selectedValue)
      ? checked.filter(v => v !== selectedValue)
      : [...checked, selectedValue];

    setChecked(newState);
    onChange(newState);
  };

  useEffect(() => {
    setChecked(value);
  }, [value]);

  const renderCheckboxes = () =>
    options?.map(option => (
      <FormControlLabel
        key={`${name}-${option.id}`}
        control={
          <Checkbox
            as={Checkbox}
            onChange={handleChange}
            value={option.id}
            checked={checked.includes(option.id)}
            disabled={disableField}
          />
        }
        label={optionText(option, i18n)}
      />
    ));

  return <>{renderCheckboxes()}</>;
};

CheckboxGroup.displayName = "CheckboxGroup";

CheckboxGroup.propTypes = {
  commonInputProps: PropTypes.shape({
    disabled: PropTypes.bool,
    name: PropTypes.string.isRequired
  }),
  metaInputProps: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array,
  value: PropTypes.any
};

export default CheckboxGroup;
