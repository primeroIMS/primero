import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";

const Seperator = ({ commonInputProps }) => {
  const { label } = commonInputProps;

  return <Typography variant="h6">{label}</Typography>;
};

Seperator.displayName = "Seperator";

Seperator.propTypes = {
  commonInputProps: PropTypes.shape({
    label: PropTypes.string.isRequired
  })
};

export default Seperator;
