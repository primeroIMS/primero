import React from "react";
import PropTypes from "prop-types";

const NotImplemented = ({ text }) => {
  return (
    <div>
      <p>{text || "Not Yet Implemented"}</p>
    </div>
  );
};

NotImplemented.propTypes = {
  text: PropTypes.string
};

export default NotImplemented;
