import React from "react";
import PropTypes from "prop-types";

const Label = ({ commonInputProps }) => {
  const { label, className } = commonInputProps;
  const classToApply = className || "";

  return <div className={classToApply}>{label}</div>;
};

Label.displayName = "Label";

Label.propTypes = {
  commonInputProps: PropTypes.shape({
    className: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    label: PropTypes.string
  })
};

export default Label;
