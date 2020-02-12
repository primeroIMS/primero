import React, { useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { useI18n } from "../../i18n";

import { DONE } from "./constants";
import ReferralAction from "./referral-action";

const ReferralActionMenu = ({ transition, recordType }) => {
  const i18n = useI18n();
  const [referralMenu, setReferralMenu] = useState(null);
  const [referralOpen, setReferralOpen] = useState(false);
  const [referralType, SetReferralType] = useState(DONE);
  const handleTransferMenuClose = () => {
    setTransferMenu(null);
  };

  const handleDoneOpen = event => {
    event.stopPropagation();
    handleTransferMenuClose();
    setReferralType(DONE);
    setReferralOpen(true);
  };

  const handleReferralMenuClick = event => {
    event.stopPropagation();
    setReferralMenu(event.currentTarget);
  };

  const handleClose = () => {
    setReferralOpen(false);
  };

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleReferralMenuClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={transferMenu}
        keepMounted
        open={Boolean(transferMenu)}
        onClose={handleTransferMenuClose}
      >
        <MenuItem
          key={DONE}
          selected={false}
          onClick={handleDoneOpen}
          disabled={false}
        >
          {i18n.t("buttons.done")}
        </MenuItem>
      </Menu>

      <ReferralAction
        openDoneDialog={referralOpen}
        close={handleClose}
        recordId={transition.record_id}
        transistionId={transition.id}
        recordType={recordType}
      />
    </>
  );
};

ReferralActionMenu.propTypes = {
  recordType: PropTypes.string,
  transition: PropTypes.object
};

export default ReferralActionMenu;
