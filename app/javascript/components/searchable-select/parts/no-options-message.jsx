import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";

const NoOptionsMessage = props => {
  const { selectProps, innerProps, children } = props;
  return (
    <Typography
      color="textSecondary"
      className={selectProps.classes.noOptionsMessage}
      {...innerProps}
    >
      {children}
    </Typography>
  );
};

NoOptionsMessage.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object.isRequired,
  selectProps: PropTypes.object.isRequired
};

export default NoOptionsMessage;
