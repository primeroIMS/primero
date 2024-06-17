// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Button } from "@mui/material";
import { cx } from "@emotion/css"
import PropTypes from "prop-types";

import css from "./styles.css";

function DashboardChip({ label, type, handleClick }) {
  const handler = typeof handleClick === "function" ? handleClick : null;
  const classes = cx(css.chip, css[type]);

  return (
    <Button
      data-testid="chip-button"
      id={`chip-${type}`}
      label={label}
      className={classes}
      onClick={handler}
      variant="text"
    >
      {label}
    </Button>
  );
}

DashboardChip.displayName = "DashboardChip";

DashboardChip.propTypes = {
  handleClick: PropTypes.func,
  label: PropTypes.string,
  type: PropTypes.string
};

export default DashboardChip;
