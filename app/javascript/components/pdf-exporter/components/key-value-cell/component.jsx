import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { List, fromJS } from "immutable";
import { isEmpty } from "lodash";
import { makeStyles } from "@material-ui/core";
import CheckBox from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlank from "@material-ui/icons/CheckBoxOutlineBlank";

import { getOptions } from "../../../form/selectors";
import { optionText } from "../../../form/utils";
import { useI18n } from "../../../i18n";
import { DATE_TIME_FORMAT, DATE_FORMAT } from "../../../../config";

import styles from "./styles.css";

const Component = ({
  isDateWithTime,
  displayName,
  value,
  optionsStringSource,
  options,
  isBooleanField,
  isDateField
}) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  const hasOptions = optionsStringSource || !isEmpty(options);
  const isAgency = optionsStringSource === "Agency";
  const lookups = useSelector(
    state => getOptions(state, optionsStringSource, i18n, options, isAgency),
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

    if (isDateField && fieldValue) {
      return i18n.localizeDate(fieldValue, isDateWithTime ? DATE_TIME_FORMAT : DATE_FORMAT);
    }

    if (isBooleanField) {
      return fieldValue ? <CheckBox /> : <CheckBoxOutlineBlank />;
    }

    return String(fieldValue);
  };

  return (
    <div className={css.cell}>
      <div>{displayName}</div>
      <div>{renderValue(value)}</div>
    </div>
  );
};

Component.displayName = "KeyValueCell";

Component.defaultProps = {
  isBooleanField: false,
  isDateField: false,
  isDateWithTime: false,
  optionsStringSource: null,
  value: ""
};

Component.propTypes = {
  displayName: PropTypes.string.isRequired,
  isBooleanField: PropTypes.bool,
  isDateField: PropTypes.bool,
  isDateWithTime: PropTypes.bool,
  options: PropTypes.object,
  optionsStringSource: PropTypes.string,
  value: PropTypes.any
};

export default Component;
