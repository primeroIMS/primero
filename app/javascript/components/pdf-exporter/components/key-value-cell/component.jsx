import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { List, fromJS } from "immutable";
import { isEmpty } from "lodash";
import { makeStyles } from "@material-ui/core";
import CheckBox from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlank from "@material-ui/icons/CheckBoxOutlineBlank";
import RadioButtonChecked from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUnchecked from "@material-ui/icons/RadioButtonUnchecked";
import clsx from "clsx";

import { getOptions } from "../../../form/selectors";
import { optionText } from "../../../form/utils";
import { useI18n } from "../../../i18n";
import { DATE_TIME_FORMAT, DATE_FORMAT } from "../../../../config";
import { DATE_FIELD, TICK_FIELD, RADIO_FIELD } from "../../../form";

import styles from "./styles.css";

const useStyles = makeStyles(styles);

const Component = ({
  classes,
  defaultValue,
  displayName,
  isDateWithTime,
  isSubform,
  options,
  optionsStringSource,
  type,
  value
}) => {
  const i18n = useI18n();
  const css = useStyles();

  const isDateField = type === DATE_FIELD;
  const isBooleanField = type === TICK_FIELD;
  const isRadioField = type === RADIO_FIELD;

  const hasOptions = optionsStringSource || !isEmpty(options);
  const isAgency = optionsStringSource === "Agency";
  const cellValue = value || defaultValue;

  const lookups = useSelector(
    state => getOptions(state, optionsStringSource, i18n, options, isAgency),
    () => hasOptions && !isEmpty(cellValue)
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

    if (isRadioField) {
      return lookups.map(lookup => {
        const radioButton = lookup.get("id") === String(value) ? <RadioButtonChecked /> : <RadioButtonUnchecked />;

        return (
          <div className={css.radioButtons}>
            {radioButton}
            {lookup.get("display_text")}
          </div>
        );
      });
    }

    if (isBooleanField) {
      const checkbox = fieldValue ? <CheckBox /> : <CheckBoxOutlineBlank />;

      return (
        <div className={css.radioButtons}>
          {checkbox}
          {i18n.t("yes_label")}
        </div>
      );
    }

    return fieldValue;
  };
  const kevValueCellClasses = clsx(classes.cell, {
    [classes.subform]: isSubform
  });

  return (
    <div className={kevValueCellClasses}>
      <div>{displayName}</div>
      <div>{renderValue(cellValue)}</div>
    </div>
  );
};

Component.displayName = "KeyValueCell";

Component.defaultProps = {
  isDateWithTime: false,
  isSubform: false,
  optionsStringSource: null,
  value: ""
};

Component.propTypes = {
  classes: PropTypes.object.isRequired,
  defaultValue: PropTypes.any,
  displayName: PropTypes.string.isRequired,
  isDateWithTime: PropTypes.bool,
  isSubform: PropTypes.bool,
  options: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  optionsStringSource: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.any
};

export default Component;
