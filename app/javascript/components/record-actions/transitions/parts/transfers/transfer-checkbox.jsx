import React from "react";
import PropTypes from "prop-types";
import { FormControlLabel, Checkbox } from "@material-ui/core";

const TransferCheckbox = ({ checked, onChange, label, disabled }) => {
  return (
    <FormControlLabel
      control={
        <Checkbox checked={checked} onChange={onChange} disabled={disabled} />
      }
      label={label}
    />
  );
};

TransferCheckbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default TransferCheckbox;
