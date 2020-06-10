import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FormControlLabel, Checkbox } from "@material-ui/core";

import { useI18n } from "../../i18n";
import { optionText } from "../utils/which-options";
import Tooltip from "../../tooltip";

const CheckboxGroup = ({ onChange, value, options, commonInputProps }) => {
  const i18n = useI18n();
  const [checked, setChecked] = useState([]);
  const { name, disabled } = commonInputProps;

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
            disabled={disabled}
          />
        }
        label={
          <Tooltip title={option?.tooltip} i18nTitle={option?.tooltipI18n}>
            <span>{optionText(option, i18n.locale)}</span>
          </Tooltip>
        }
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
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array,
  value: PropTypes.any
};

export default CheckboxGroup;
