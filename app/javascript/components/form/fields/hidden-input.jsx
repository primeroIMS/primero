// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

const HiddenInput = ({ commonInputProps, formMethods }) => {
  const { name } = commonInputProps;
  const { register } = formMethods;

  return <input id={name} type="hidden" ref={register} name={name} />;
};

HiddenInput.displayName = "HiddenInput";

HiddenInput.propTypes = {
  commonInputProps: PropTypes.object.isRequired,
  formMethods: PropTypes.object.isRequired
};

export default HiddenInput;
