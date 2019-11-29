import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";

const SingleValue = props => {
  const { selectProps, innerProps, children, options, data } = props;

  const foundOption = options.find(op => op.value === data.value);
  const translatedLabel =
    foundOption.label !== children ? foundOption.label : children;

  return (
    <Typography
      noWrap
      className={selectProps.classes.singleValue}
      {...innerProps}
    >
      {translatedLabel}
    </Typography>
  );
};

SingleValue.propTypes = {
  children: PropTypes.node,
  data: PropTypes.object,
  innerProps: PropTypes.any,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  selectProps: PropTypes.object.isRequired
};

export default SingleValue;
