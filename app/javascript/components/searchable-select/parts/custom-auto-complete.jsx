import React from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import ReactSelect from "react-select";
import NoSsr from "@material-ui/core/NoSsr";

import { useI18n } from "../../i18n";

import { CUSTOM_AUTOCOMPLETE_NAME } from "./constants";
import styles from "./styles.css";

import {
  NoOptionsMessage,
  Control,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
  MultiValue,
  Menu
} from ".";

const CustomAutoComplete = ({ props }) => {
  const css = makeStyles(styles)();
  const theme = useTheme();

  const i18n = useI18n();
  const { id, options, excludeEmpty, defaultValues, ...rest } = props;

  const components = {
    Control,
    Menu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer
  };

  const selectStyles = {
    input: base => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit"
      }
    })
  };
  const searchOptions = excludeEmpty
    ? options
    : [{ value: "", label: i18n.t("fields.select_single") }, ...options];

  return (
    <NoSsr>
      <ReactSelect
        id={id}
        className={css.root}
        styles={selectStyles}
        components={components}
        menuPosition="fixed"
        options={searchOptions}
        value={excludeEmpty ? defaultValues : searchOptions[0]}
        {...rest}
      />
    </NoSsr>
  );
};

CustomAutoComplete.displayName = CUSTOM_AUTOCOMPLETE_NAME;

CustomAutoComplete.propTypes = {
  components: PropTypes.object,
  id: PropTypes.string,
  props: PropTypes.object
};

export default CustomAutoComplete;
