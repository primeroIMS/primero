import React from "react";
import PropTypes from "prop-types";

import { SEPERATOR_NAME } from "./constants";

const Seperator = ({ label }) => {
  return (
    <>
      <h4>{label}</h4>
    </>
  );
};

Seperator.displayName = SEPERATOR_NAME;

Seperator.propTypes = {
  label: PropTypes.string
};

export default Seperator;
