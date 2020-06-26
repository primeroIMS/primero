import React from "react";
import PropTypes from "prop-types";
import { Icon, Badge } from "@material-ui/core";
import { Photo, Flag } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";

import Jewel from "../../jewel";
import { ALERTS_COLUMNS } from "../../record-list/constants";
import { ConditionalWrapper } from "../../../libs";

import styles from "./styles.css";

const ToggleIconCell = ({ value, icon }) => {
  const css = makeStyles(styles)();

  if (!value) {
    return null;
  }

  const renderIconType = {
    photo: <Photo />,
    flag_count: <Flag className={css.flagIcon} />,
    alert_count: <Jewel isList />
  }[icon];

  return (
    <ConditionalWrapper
      condition={icon === ALERTS_COLUMNS.flag_count}
      wrapper={Badge}
      badgeContent={value}
      color="secondary"
      classes={{ badge: css.badge }}
    >
      <Icon color="primary" className={css.iconButton}>
        {renderIconType}
      </Icon>
    </ConditionalWrapper>
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
