// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Button } from "@material-ui/core";
import clsx from "clsx";
import PropTypes from "prop-types";

import css from "./styles.css";

const DashboardChip = ({ label, type, handleClick }) => {
  const handler = typeof handleClick === "function" ? handleClick : null;
  const classes = clsx({ [css.chip]: true, [css[type]]: true, [css.disabled]: handler === null });

  return (
    <Button id={`chip-${type}`} label={label} className={classes} onClick={handler} variant="text">
      {label}
    </Button>
  );
};

DashboardChip.displayName = "DashboardChip";

DashboardChip.propTypes = {
  handleClick: PropTypes.func,
  label: PropTypes.string,
  type: PropTypes.string
};

export default DashboardChip;
