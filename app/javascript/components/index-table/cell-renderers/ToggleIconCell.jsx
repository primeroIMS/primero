import React from "react";
import PropTypes from "prop-types";
import { Icon } from "@material-ui/core";
import { Photo, Flag } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";

import Jewel from "../../jewel";
import { ALERTS_COLUMNS } from "../../record-list/constants";

import styles from "./styles.css";

const ToggleIconCell = ({ value, icon }) => {
  const css = makeStyles(styles)();

  if (!value) {
    return null;
  }
  const renderValue = icon === ALERTS_COLUMNS.flag_count && (
    <span className={css.iconValue}>{value}</span>
  );
  const renderIconType = {
    photo: <Photo />,
    flag_count: <Flag className={css.flagIcon} />,
    alert_count: <Jewel isList />
  }[icon];

  return (
    <>
      <Icon color="primary" className={css.iconButton}>
        {renderValue}
        {renderIconType}
      </Icon>
    </>
  );
};

ToggleIconCell.displayName = "ToggleIconCell";

ToggleIconCell.propTypes = {
  icon: PropTypes.oneOf([
    ALERTS_COLUMNS.photo,
    ALERTS_COLUMNS.flag_count,
    ALERTS_COLUMNS.alert_count
  ]),
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
    PropTypes.number
  ])
};

export default ToggleIconCell;
