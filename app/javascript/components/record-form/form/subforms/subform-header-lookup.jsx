import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";

import { useI18n } from "../../../i18n";
import { getOption } from "../../selectors";

const LookupHeader = ({ value, optionsStringSource }) => {
  const i18n = useI18n();
  const optionsStrings = useSelector(state =>
    getOption(state, optionsStringSource, i18n)
  );

  if (isEmpty(value)) return value;
  const { display_text: displayText } = optionsStrings.find(
    o => o.id === value
  );

  return <span>{displayText}</span>;
};

LookupHeader.displayName = "LookupHeader";

LookupHeader.propTypes = {
  optionsStringSource: PropTypes.string,
  value: PropTypes.string
};

export default LookupHeader;
