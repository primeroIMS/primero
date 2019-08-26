import React from "react";
import PropTypes from "prop-types";
import { IconButton } from "@material-ui/core";
import { Photo, Flag } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import styles from "./styles.css";

const ToggleIconCell = ({ value, icon }) => {
  const css = makeStyles(styles)();
  return value ? (
    <IconButton color="primary" className={css.IconButton}>
      {icon === "flag" && <span className={css.IconValue}>{value}</span>}
      {
        {
          photo: <Photo className={css.FlagIcon} />,
          flag: <Flag className={css.FlagIcon} />
        }[icon]
      }
    </IconButton>
  ) : null;
};

ToggleIconCell.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
    PropTypes.number
  ]),
  icon: PropTypes.oneOf(["photo", "flag"])
};

export default ToggleIconCell;
