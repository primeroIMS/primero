import React from "react";
import PropTypes from "prop-types";
import {
  InputLabel,
  FormControl,
  MenuItem,
  Input,
  ListItemText,
  Checkbox
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Select } from "formik-material-ui";
import { FastField } from "formik";
import omitBy from "lodash/omitBy";
import { useSelector } from "react-redux";
import { useI18n } from "components/i18n";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import find from "lodash/find";
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
  label,
  option,
  InputLabelProps,
  InputProps,
  multiple,
  mode,
  value,
  ...other
}) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  const options = (() => {
    if (typeof option === "string") {
      return useSelector(state =>
        getOption(state, option.replace(/lookup /, ""))
      );
    }

    return option[i18n.locale];
  })();

  const findOptionDisplayText = v =>
    (find(options, { id: v }) || {}).display_text;

  const fieldProps = {
    component: Select,
    ...omitBy(other, (v, k) =>
      ["InputProps", "helperText", "InputLabelProps"].includes(k)
    ),
    displayEmpty: !mode.isShow,
    input: <Input />,
    renderValue: selected => {
      return multiple
        ? selected.map(s => findOptionDisplayText(s)).join(", ")
        : findOptionDisplayText(value);
    },
    MenuProps,
    multiple,
    value,
    IconComponent: !mode.isShow ? ArrowDropDownIcon : () => null
  };

  return (
    <FormControl fullWidth className={css.selectField}>
      <InputLabel shrink htmlFor={other.name} {...InputLabelProps}>
        {label}
      </InputLabel>
      <FastField {...fieldProps}>
        <MenuItem value="">
          {multiple
            ? i18n.t("fields.select_multiple")
            : i18n.t("fields.select_single")}
        </MenuItem>
        {options.length > 0 &&
          options.map(o => (
            <MenuItem key={o.id} value={o.id}>
              {multiple && <Checkbox checked={value.indexOf(o.id) > -1} />}
              <ListItemText primary={o.display_text} />
            </MenuItem>
          ))}
      </FastField>
    </FormControl>
  );
};

SelectField.propTypes = {
  label: PropTypes.string.isRequired,
  option: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  multiple: PropTypes.bool,
  InputLabelProps: PropTypes.object,
  InputProps: PropTypes.object,
  mode: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};

export default SelectField;
