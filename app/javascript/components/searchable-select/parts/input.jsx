import PropTypes from "prop-types";
import React from "react";

const Component = ({ inputRef, ...props }) => {
  return <div ref={inputRef} {...props} />;
};

Component.propTypes = {
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.any.isRequired
    })
  ])
};

export default Component;
