import React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";

import { NAME } from "./constants";

const Component = ({ text }) => {
  const theme = useTheme();
  const mobileDisplay = useMediaQuery(theme.breakpoints.down("sm"));

  if (mobileDisplay) {
    return null;
  }

  return <>{text}</>;
};

Component.displayName = NAME;

Component.propTypes = {
  text: PropTypes.string.isRequired
};

export default Component;
