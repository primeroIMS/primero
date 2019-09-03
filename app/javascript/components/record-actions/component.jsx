import React from "react";
import PropTypes from "prop-types";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import { useI18n } from "components/i18n";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const RecordActions = ({ recordType, iconColor }) => {
  const i18n = useI18n();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const actions = [
    {
      name: i18n.t("buttons.import"),
      action: () => console.log("Some action"),
      recordType: "all"
    },
    {
      name: i18n.t("exports.custom_exports.label"),
      action: () => console.log("Some action"),
      recordType: "all"
    },
    {
      name: i18n.t("buttons.mark_for_mobile"),
      action: () => console.log("Some action"),
      recordType: "all"
    },
    {
      name: i18n.t("buttons.unmark_for_mobile"),
      action: () => console.log("Some action"),
      recordType: "all"
    },
    {
      name: `${i18n.t("buttons.referral")} ${recordType}`,
      action: () => console.log("Some action"),
      recordType: "cases"
    },
    {
      name: `${i18n.t("buttons.reassign")} ${recordType}`,
      action: () => console.log("Some action"),
      recordType: "cases"
    },
    {
      name: `${i18n.t("buttons.transfer")} ${recordType}`,
      action: () => console.log("Some action"),
      recordType: "cases"
    },
    {
      name: i18n.t("actions.incident_details_from_case"),
      action: () => console.log("Some action"),
      recordType: "cases"
    },
    {
      name: i18n.t("actions.services_section_from_case"),
      action: () => console.log("Some action"),
      recordType: "cases"
    }
  ];

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
        {actions
          .filter(a => {
            return (
              a.recordType === "all" ||
              a.recordType === recordType ||
              (Array.isArray(a.recordType) && a.recordType.includes(recordType))
            );
          })
          .map(action => (
            <MenuItem
              key={action.name}
              selected={action.name === "Pyxis"}
              onClick={handleClose}
            >
              {action.name}
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
