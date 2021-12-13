import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";

import { useI18n } from "../../../../i18n";
import { SUBFORM_LOOKUP_HEADER_NAME } from "../constants";
import useOptions from "../../../../form/use-options";

import { getMultiSelectValues } from "./utils";

const Component = ({ value, optionsStringSource, optionsStringText, isViolationSubform, displayName }) => {
  const i18n = useI18n();
  const optionsStrings = useOptions({ source: optionsStringSource });
  const renderDisplayName = isViolationSubform && `${displayName?.[i18n.locale]}: `;

  if (isEmpty(value)) return <>{value}</>;

  if (!isEmpty(optionsStringSource)) {
    const { display_text: displayText } = optionsStrings.find(o => o.id === value) || {};

    if (!Array.isArray(value)) {
      return (
        <span>
          {renderDisplayName}
          {displayText}
        </span>
      );
    }

    const texts = getMultiSelectValues(value, optionsStrings);

    return (
      <span>
        {renderDisplayName}
        {texts}
      </span>
    );
  }

  if (Array.isArray(value)) {
    const texts = getMultiSelectValues(value, optionsStringText, i18n.locale);

    return (
      <span>
        {renderDisplayName}
        {texts}
      </span>
    );
  }

  const { display_text: displayText } = optionsStringText.find(optionStringText => optionStringText.id === value);

  return (
    <span>
      {renderDisplayName}
      {displayText[i18n.locale]}
    </span>
  );
};

Component.displayName = SUBFORM_LOOKUP_HEADER_NAME;

Component.defaultProps = {
  value: ""
};

Component.propTypes = {
  displayName: PropTypes.object,
  isViolationSubform: PropTypes.bool,
  optionsStringSource: PropTypes.string,
  optionsStringText: PropTypes.array,
  value: PropTypes.string
};

export default Component;
