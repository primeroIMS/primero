import React from "react";
import PropTypes from "prop-types";

import Tooltip from "../../tooltip";

const InputLabel = ({ tooltip, i18nTitle, text }) => {
  return (
    <Tooltip title={tooltip} i18nTitle={i18nTitle}>
      <span>{text}</span>
    </Tooltip>
  );
};

InputLabel.displayName = "InputLabel";

InputLabel.defaultProps = {
  i18nTitle: false,
  text: "",
  tooltip: ""
};

InputLabel.propTypes = {
  i18nTitle: PropTypes.bool,
  text: PropTypes.string,
  tooltip: PropTypes.string
};

export default InputLabel;
