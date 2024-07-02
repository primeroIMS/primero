// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { useMediaQuery } from "@mui/material";

import { NAME } from "./constants";

function Component({ text, keepTextOnMobile = false }) {
  const mobileDisplay = useMediaQuery(theme => theme.breakpoints.down("sm"));

  if (mobileDisplay && !keepTextOnMobile) {
    return null;
  }

  return <>{text}</>;
}

Component.displayName = NAME;

Component.propTypes = {
  keepTextOnMobile: PropTypes.bool,
  text: PropTypes.string.isRequired
};

export default Component;
