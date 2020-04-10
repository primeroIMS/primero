import PropTypes from "prop-types";
import React from "react";

import { INPUT_NAME as NAME } from "./constants";

const Component = ({ inputRef, ...props }) => {
  return <div ref={inputRef} {...props} />;
};

Component.displayName = NAME;

Component.propTypes = {
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.any.isRequired
    })
  ])
};

export default Component;
