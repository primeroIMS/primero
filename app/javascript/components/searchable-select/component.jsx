import React from "react";
import PropTypes from "prop-types";

import ReactSelect from "react-select";
import NoSsr from "@material-ui/core/NoSsr";
import { emphasize, makeStyles, useTheme } from "@material-ui/core/styles";
import {
  NoOptionsMessage,
  Control,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
  MultiValue,
  Menu
} from "./parts";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: 250,
    minWidth: 290,
    marginTop: 5
  },
  input: {
    display: "flex",
    padding: 0,
    height: "auto"
  },
  valueContainer: {
    display: "flex",
    flexWrap: "wrap",
    flex: 1,
    alignItems: "center",
    overflow: "hidden"
  },
  chip: {
    margin: theme.spacing(0.5, 0.25)
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === "light"
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    )
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2)
  },
  singleValue: {
    fontSize: 16
  },
  placeholder: {
    position: "absolute",
    left: 2,
    bottom: 6,
    fontSize: 16
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  divider: {
    height: theme.spacing(2)
  }
}));

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

const CustomAutoComplete = props => {
  const classes = useStyles();
  const theme = useTheme();
  const { id } = props;

  const selectStyles = {
    input: base => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit"
      }
    })
  };

  return (
    <NoSsr>
      <ReactSelect
        id={id}
        classes={classes}
        styles={selectStyles}
        components={components}
        {...props}
      />
    </NoSsr>
  );
};

CustomAutoComplete.propTypes = {
  id: PropTypes.string.isRequired
};

export default CustomAutoComplete;
