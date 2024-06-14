// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import isFunction from "lodash/isFunction";

import Tooltip from "../../tooltip";

const InputLabel = ({ tooltip = "", i18nTitle = false, text = "" }) => {
  const renderText = isFunction(text) ? text() : text;

  return (
    <Tooltip title={tooltip} i18nTitle={i18nTitle}>
      <span>{renderText}</span>
    </Tooltip>
  );
};

InputLabel.displayName = "InputLabel";

InputLabel.propTypes = {
  i18nTitle: PropTypes.bool,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  tooltip: PropTypes.string
};

export default InputLabel;
