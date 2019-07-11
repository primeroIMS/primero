import React from "react";
import PropTypes from "prop-types";
import { InputLabel, FormControl, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Select } from "formik-material-ui";
import { Field } from "formik";
import omitBy from "lodash/omitBy";
import { useSelector } from "react-redux";
import { useI18n } from "components/i18n";
import { getOption } from "../selectors";
import styles from "./styles.css";

const SelectField = ({
  label,
  option,
  InputLabelProps,
  InputProps,
  multiple,
  mode,
  ...other
}) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  const fieldProps = {
    component: Select,
    ...omitBy(other, (v, k) =>
      ["InputProps", "helperText", "InputLabelProps"].includes(k)
    ),
    displayEmpty: !mode.isShow
  };

  const options = (() => {
    if (typeof option === "string") {
      return useSelector(state =>
        getOption(state, option.replace(/lookup /, ""))
      );
    }

    return option[i18n.locale];
  })();

  return (
    <FormControl fullWidth className={css.selectField}>
      <InputLabel shrink htmlFor={other.name} {...InputLabelProps}>
        {label}
      </InputLabel>
      <Field {...fieldProps}>
        <MenuItem value="">
          {multiple
            ? i18n.t("fields.select_multiple")
            : i18n.t("fields.select_single")}
        </MenuItem>
        {options.length > 0 &&
          options.map(o => (
            <MenuItem key={o.id} value={o.id}>
              {o.display_text}
            </MenuItem>
          ))}
      </Field>
    </FormControl>
  );
};

SelectField.propTypes = {
  label: PropTypes.string.isRequired,
  option: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  multiple: PropTypes.bool,
  InputLabelProps: PropTypes.object,
  InputProps: PropTypes.object,
  mode: PropTypes.object
};

export default SelectField;
