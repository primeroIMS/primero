import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { List, fromJS } from "immutable";
import { isEmpty } from "lodash";
import { format, parseISO } from "date-fns";
import { makeStyles } from "@material-ui/core";

import { getOptions } from "../../../../../../form/selectors";
import { optionText } from "../../../../../../form/utils";
import { useI18n } from "../../../../../../i18n";
import { DATE_TIME_FORMAT, DATE_FORMAT } from "../../../../../../../config";

import styles from "./styles.css";

const Component = ({ date, dateWithTime, displayName, value, optionsStringSource, options }) => {
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

    if (date && fieldValue) {
      return format(parseISO(fieldValue), dateWithTime ? DATE_TIME_FORMAT : DATE_FORMAT);
    }

    return fieldValue;
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
  optionsStringSource: null,
  value: ""
};

Component.propTypes = {
  date: PropTypes.bool,
  dateWithTime: PropTypes.bool,
  displayName: PropTypes.string.isRequired,
  options: PropTypes.object,
  optionsStringSource: PropTypes.string,
  value: PropTypes.any
};

export default Component;
