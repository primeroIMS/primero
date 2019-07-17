import React from "react";
import PropTypes from "prop-types";

const Seperator = ({ label }) => {
  return (
    <>
      <h4>{label}</h4>
    </>
  );
};

Seperator.propTypes = {
  label: PropTypes.string
};

export default Seperator;
