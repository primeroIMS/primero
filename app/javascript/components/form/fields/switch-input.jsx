import React from "react";
import PropTypes from "prop-types";
import {
  Switch,
  FormControl,
  FormGroup,
  FormControlLabel
} from "@material-ui/core";

import Input from "../components/input";

const SwitchInput = ({ field }) => {
  return (
    <Input field={field}>
      {({ handleChange, inputValue, label }) => (
        <FormControl>
          <FormGroup>
            <FormControlLabel
              labelPlacement="end"
              control={
                <Switch
                  onChange={handleChange}
                  checked={Boolean(inputValue) || false}
                />
              }
              label={label}
            />
          </FormGroup>
        </FormControl>
      )}
    </Input>
  );
};

SwitchInput.displayName = "SwitchInput";

SwitchInput.propTypes = {
  field: PropTypes.object.isRequired
};

export default SwitchInput;
