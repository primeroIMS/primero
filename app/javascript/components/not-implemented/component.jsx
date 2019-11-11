import React from "react";
import PropTypes from "prop-types";

const NotImplemented = ({ text }) => {
  return (
    <div>
      <p>*** NOT IMPLEMENTED {text} ***</p>
    </div>
  );
};

NotImplemented.displayName = "NotImplemented";

NotImplemented.propTypes = {
  text: PropTypes.string
};

export default NotImplemented;
