import React from "react";
import Chip from "@material-ui/core/Chip";
import PropTypes from "prop-types";
import clsx from "clsx";
import makeStyles from "@material-ui/styles/makeStyles";
import styles from "./styles.css";

const DashboardChip = ({ label, type }) => {
  const css = makeStyles(styles)();

  return (
    <Chip label={label} className={clsx(css.chip, css[type])} size="small" />
  );
};

DashboardChip.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string
};

export default DashboardChip;
