import Chip from "@material-ui/core/Chip";
import clsx from "clsx";
import makeStyles from "@material-ui/styles/makeStyles";
import PropTypes from "prop-types";
import React from "react";

import styles from "./styles.css";

const DashboardChip = ({ label, type, handleClick }) => {
  const css = makeStyles(styles)();

  const handler = typeof handleClick === "function" ? handleClick : null;

  return (
    <Chip
      label={label}
      className={clsx(css.chip, css[type])}
      size="small"
      onClick={handler}
    />
  );
};

DashboardChip.displayName = "DashboardChip";

DashboardChip.propTypes = {
  handleClick: PropTypes.func,
  label: PropTypes.string,
  type: PropTypes.string
};

export default DashboardChip;
