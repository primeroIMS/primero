import PropTypes from "prop-types";
import { Icon, Badge } from "@material-ui/core";
import Photo from "@material-ui/icons/Photo";
import OfflinePin from "@material-ui/icons/OfflinePin";
import Jewel from "../../jewel";
import { ALERTS_COLUMNS } from "../../record-list/constants";
import { ConditionalWrapper } from "../../../libs";
import { FlagIcon } from "../../../images/primero-icons";
import css from "./styles.css";
const ToggleIconCell = ({ value, icon }) => {
  if (!value) {
    return null;
  }

  const renderIconType = {
    photo: <Photo />,
    flag_count: <FlagIcon className={css.flagIcon} />,
    alert_count: <Jewel isList />,
    complete: <OfflinePin className={css.offlinePinIcon} />
  }[icon];
  return (
    <ConditionalWrapper
      condition={icon === ALERTS_COLUMNS.flag_count}
      wrapper={Badge}
      badgeContent={value}
      color="secondary"
      classes={{ badge: css.badge }}
      data-testid = "flag-icon"
    >
      <Icon color="primary" className={css[icon === "complete" ? "iconButtonOffline" : "iconButton"]} data-testid="toggle-icon-cell">
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
