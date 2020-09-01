import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { List, fromJS } from "immutable";
import { isEmpty } from "lodash";

import { getOptions } from "../../../../../../form/selectors";
import { optionText } from "../../../../../../form/utils";
import { useI18n } from "../../../../../../i18n";

const Component = ({ displayName, value, optionsStringSource, options }) => {
  const i18n = useI18n();
  const hasOptions = optionsStringSource || !isEmpty(options);

  const lookups = useSelector(
    state => getOptions(state, optionsStringSource, i18n, options),
    () => hasOptions && !isEmpty(value)
  );

  const renderValue = fieldValue => {
    if (Array.isArray(fieldValue) || List.isList(fieldValue)) {
      return fieldValue
        .map(val => renderValue(val))
        ?.flatten()
        .join(", ");
    }
    if (hasOptions && !lookups?.isEmpty() && !isEmpty(fieldValue)) {
      return lookups
        .filter(lookup => {
          const lookupId = fromJS(lookup).get("id");

          return List.isList(fieldValue) ? fieldValue.includes(lookupId) : fieldValue === lookupId;
        })
        .map(lookup => optionText(fromJS(lookup).toJS()));
    }

    return fieldValue;
  };

  return (
    <tr>
      <td>{displayName}</td>
      <td>{renderValue(value)}</td>
    </tr>
  );
};

Component.displayName = "KeyValueCell";

Component.defaultProps = {
  optionsStringSource: null,
  value: ""
};

Component.propTypes = {
  displayName: PropTypes.string.isRequired,
  options: PropTypes.object,
  optionsStringSource: PropTypes.string,
  value: PropTypes.any
};

export default Component;
