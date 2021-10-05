import Chip from "@material-ui/core/Chip";
import clsx from "clsx";

import PropTypes from "prop-types";

import css from "./styles.css";



const DashboardChip = ({ label, type, handleClick }) => {
  

  const handler = typeof handleClick === "function" ? handleClick : null;
  const classes = clsx(css.chip, css[type]);

  return <Chip label={label} className={classes} size="small" onClick={handler} />;
};

DashboardChip.displayName = "DashboardChip";

DashboardChip.propTypes = {
  handleClick: PropTypes.func,
  label: PropTypes.string,
  type: PropTypes.string
};

export default DashboardChip;
