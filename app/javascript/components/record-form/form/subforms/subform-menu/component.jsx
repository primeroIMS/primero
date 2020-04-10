import React, { useState } from "react";
import { batch, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Menu, MenuItem, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { setServiceToRefer } from "../../../action-creators";
import { setDialog } from "../../../../record-actions/action-creators";
import { useI18n } from "../../../../i18n";

import { NAME } from "./constants";

const Component = ({ index, values }) => {
  const i18n = useI18n();
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleReferral = () => {
    batch(() => {
      dispatch(setServiceToRefer({ ...values[index] }));
      dispatch(setDialog({ dialog: "referral", open: true }));
    });
    setAnchorEl(null);
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
        onClick={event => handleClick(event)}
        key={`refer-option-${index}`}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={`service-menu-${index}`}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        key={`service-menu-${index}`}
      >
        <MenuItem
          key={`refer-option-${index}`}
          onClick={() => handleReferral()}
        >
          {values[index].service_status_referred
            ? i18n.t("buttons.referral_again")
            : i18n.t("buttons.referral")}
        </MenuItem>
      </Menu>
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  index: PropTypes.number.isRequired,
  values: PropTypes.array.isRequired
};

export default Component;
