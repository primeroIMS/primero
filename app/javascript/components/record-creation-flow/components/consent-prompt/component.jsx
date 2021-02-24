import React from "react";
import PropTypes from "prop-types";

import { NAME } from "./constants";

const Component = ({ recordType }) => {
  return <div>{NAME}</div>;
};

Component.displayName = NAME;

Component.propTypes = {};

export default Component;
