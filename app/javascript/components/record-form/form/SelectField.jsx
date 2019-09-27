import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  InputLabel,
  FormControl,
  FormHelperText,
  MenuItem,
  Input,
  ListItemText,
  Checkbox
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Select } from "formik-material-ui";
import { FastField, connect, getIn } from "formik";
import omitBy from "lodash/omitBy";
import { useSelector } from "react-redux";
import { useI18n } from "components/i18n";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";
import { getOption } from "../selectors";
import styles from "./styles.css";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const SelectField = ({
  name,
  field,
  label,
  helperText,
  InputLabelProps,
  InputProps,
  mode,
  disabled,
  formik,
  ...other
}) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  const option = field.option_strings_source || field.option_strings_text;

  const value = getIn(formik.values, name);

  const selectedValue = field.selected_value;

  const options = useSelector(state => getOption(state, option, i18n));

  const findOptionDisplayText = v =>
    (find(options, { id: v }) || {}).display_text;

  const fieldProps = {
    component: Select,
    name,
    ...omitBy(other, (v, k) =>
      [
        "InputProps",
        "helperText",
        "InputLabelProps",
        "recordType",
        "recordID"
      ].includes(k)
    ),
    displayEmpty: !mode.isShow,
    input: <Input />,
    native: false,
    renderValue: selected => {
      if (!options) {
        return i18n.t("string_sources_failed");
      }
      return field.multi_select
        ? selected.map(s => findOptionDisplayText(s)).join(", ") ||
            i18n.t("fields.select_multiple")
        : findOptionDisplayText(selected) || i18n.t("fields.select_single");
    },
    MenuProps,
    multiple: field.multi_select,
    IconComponent: !mode.isShow ? ArrowDropDownIcon : () => null,
    disabled: !options || disabled
  };

  const fieldError = getIn(formik.errors, name);
  const fieldTouched = getIn(formik.touched, name);

  useEffect(() => {
    if (mode.isNew && selectedValue && value === "") {
      formik.setFieldValue(name, selectedValue, false);
    }
  }, []);

  if (!isEmpty(formik.values)) {
    return (
      <FormControl
        fullWidth
        className={css.selectField}
        error={fieldError && fieldTouched}
      >
        <InputLabel shrink htmlFor={other.name} {...InputLabelProps}>
          {label}
        </InputLabel>
        <FastField {...fieldProps}>
          {options &&
            options.map(o => (
              <MenuItem key={o.id} value={o.id}>
                {field.multi_select && (
                  <Checkbox checked={value && value.indexOf(o.id) > -1} />
                )}
                <ListItemText primary={o.display_text} />
              </MenuItem>
            ))}
        </FastField>
        <FormHelperText>
          {fieldError && fieldTouched ? fieldError : helperText}
        </FormHelperText>
      </FormControl>
    );
  }

  return null;
};

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  field: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  helperText: PropTypes.string,
  InputLabelProps: PropTypes.object,
  InputProps: PropTypes.object,
  mode: PropTypes.object,
  disabled: PropTypes.bool,
  formik: PropTypes.object.isRequired
};

export default connect(SelectField);
