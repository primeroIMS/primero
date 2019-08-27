import React from "react";
import PropTypes from "prop-types";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import { useI18n } from "components/i18n";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const RecordActions = ({ recordType, iconColor }) => {
  const i18n = useI18n();
  const [anchorEl, setAnchorEl] = React.useState(null);
  // eslint-disable-next-line prefer-const
  let defaultList = [
    i18n.t("buttons.import"),
    i18n.t("exports.custom_exports.label"),
    i18n.t("buttons.mark_for_mobile"),
    i18n.t("buttons.unmark_for_mobile")
  ];

  if (recordType.toLowerCase() === "cases") {
    defaultList = defaultList.concat([
      `${i18n.t("buttons.referral")} ${recordType}`,
      `${i18n.t("buttons.reassign")} ${recordType}`,
      `${i18n.t("buttons.transfer")} ${recordType}`,
      i18n.t("actions.incident_details_from_case"),
      i18n.t("actions.services_section_from_case")
    ]);
  }

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon color={iconColor} />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {defaultList.map(option => (
          <MenuItem
            key={option}
            selected={option === "Pyxis"}
            onClick={handleClose}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

RecordActions.propTypes = {
  recordType: PropTypes.string.isRequired,
  iconColor: PropTypes.string
};

export default RecordActions;
