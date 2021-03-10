import PropTypes from "prop-types";
import { Icon, Badge } from "@material-ui/core";
import { Photo } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import Jewel from "../../jewel";
import { ALERTS_COLUMNS } from "../../record-list/constants";
import { ConditionalWrapper } from "../../../libs";
import { FlagIcon } from "../../../images/primero-icons";

import styles from "./styles.css";

const useStyles = makeStyles(styles);

const ToggleIconCell = ({ value, icon }) => {
  const css = useStyles();

  if (!value) {
    return null;
  }

  const renderIconType = {
    photo: <Photo />,
    flag_count: <FlagIcon className={css.flagIcon} />,
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
  icon: PropTypes.oneOf([ALERTS_COLUMNS.photo, ALERTS_COLUMNS.flag_count, ALERTS_COLUMNS.alert_count]),
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.array, PropTypes.number])
};

export default ToggleIconCell;
