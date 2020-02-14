import React from "react";
import PropTypes from "prop-types";

import { SEPERATOR_NAME } from "./constants";

const Seperator = ({ label, field }) => {
  if (!field?.visible) {
    return null;
  }

  return (
    <>
      <h4>{label}</h4>
    </>
  );
};

Seperator.displayName = SEPERATOR_NAME;

Seperator.propTypes = {
  field: PropTypes.object,
  label: PropTypes.string
};

export default Seperator;
