import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";

import { useI18n } from "../../../../i18n";
import { getOption } from "../../../selectors";
import { SUBFORM_LOOKUP_HEADER_NAME } from "../constants";

import { getMultiSelectValues } from "./utils";

const Component = ({ value, optionsStringSource, optionsStringText }) => {
  const i18n = useI18n();
  const optionsStrings = useSelector(state => getOption(state, optionsStringSource, i18n.locale));

  if (isEmpty(value)) return <>{value}</>;

  if (!isEmpty(optionsStringSource)) {
    const { display_text: displayText } = optionsStrings.find(o => o.id === value) || {};

    if (!Array.isArray(value)) {
      return <span>{displayText}</span>;
    }

    const texts = getMultiSelectValues(value, optionsStrings);

    return <span>{texts}</span>;
  }

  if (Array.isArray(value)) {
    const texts = getMultiSelectValues(value, optionsStringText, i18n.locale);

    return <span>{texts}</span>;
  }

  const { display_text: displayText } = optionsStringText[i18n.locale].find(
    optionStringText => optionStringText.id === value
  );

  return <span>{displayText}</span>;
};

Component.displayName = SUBFORM_LOOKUP_HEADER_NAME;

Component.propTypes = {
  optionsStringSource: PropTypes.string,
  optionsStringText: PropTypes.object,
  value: PropTypes.string
};

export default Component;
