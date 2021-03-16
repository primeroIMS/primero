/* eslint-disable camelcase */

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FormControlLabel, Checkbox } from "@material-ui/core";
import isFunction from "lodash/isFunction";

import { useI18n } from "../../i18n";
import { optionText } from "../utils/which-options";
import InputLabel from "../components/input-label";

import Separator from "./seperator";

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
    options?.map(option => {
      const text = isFunction(option?.display_name || option?.display_text)
        ? option?.display_name || option?.display_text
        : optionText(option, i18n.locale);

      return (
        <div key={`${name}-${option.id}-container`}>
          {option?.includeSeparator && (
            <Separator key={`${name}-${option.id}-separator`} commonInputProps={{ label: "" }} />
          )}
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
            label={<InputLabel text={text} tooltip={option?.tooltip} />}
          />
        </div>
      );
    });

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
