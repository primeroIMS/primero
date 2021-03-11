import Chip from "@material-ui/core/Chip";
import clsx from "clsx";
import makeStyles from "@material-ui/core/styles/makeStyles";
import PropTypes from "prop-types";

import styles from "./styles.css";

const useStyles = makeStyles(styles);

const DashboardChip = ({ label, type, handleClick }) => {
  const css = useStyles();

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
