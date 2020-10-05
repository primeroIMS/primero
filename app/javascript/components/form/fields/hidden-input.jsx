import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";

const HiddenInput = ({ commonInputProps }) => {
  const { name } = commonInputProps;
  const { register } = useFormContext();

  return <input type="hidden" ref={register} name={name} />;
};

HiddenInput.displayName = "HiddenInput";

HiddenInput.propTypes = {
  commonInputProps: PropTypes.object.isRequired
};

export default HiddenInput;
