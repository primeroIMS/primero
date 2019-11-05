import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useI18n } from "components/i18n";
import isEmpty from "lodash/isEmpty";
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

LookupHeader.propTypes = {
  value: PropTypes.string,
  optionsStringSource: PropTypes.string
};

export default LookupHeader;
