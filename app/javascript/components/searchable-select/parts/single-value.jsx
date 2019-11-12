import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";

const SingleValue = props => {
  const { selectProps, innerProps, children } = props;

  return (
    <Typography className={selectProps.classes.singleValue} {...innerProps}>
      {children}
    </Typography>
  );
};

SingleValue.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.any,
  selectProps: PropTypes.object.isRequired
};

export default SingleValue;
