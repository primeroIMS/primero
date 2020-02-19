import React from "react";
import PropTypes from "prop-types";
import { IconButton } from "@material-ui/core";
import { Photo, Flag } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";

import { Jewel } from "../../jewel";

import styles from "./styles.css";

const ToggleIconCell = ({ value, icon }) => {
  const css = makeStyles(styles)();

  return value ? (
    <IconButton color="primary" className={css.iconButton}>
      {
        {
          photo: <Photo />,
          flag_count: <Flag />,
          alert_count: <Jewel isForm />
        }[icon]
      }
    </IconButton>
  ) : null;
};

ToggleIconCell.displayName = "ToggleIconCell";

ToggleIconCell.propTypes = {
  icon: PropTypes.oneOf(["photo", "flag", "alert_count"]),
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
    PropTypes.number
  ])
};

export default ToggleIconCell;
