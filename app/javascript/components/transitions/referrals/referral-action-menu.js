import { useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { useI18n } from "../../i18n";
import { useDialog } from "../../action-dialog";

import { DONE, REFERRAL_DONE_DIALOG, REFERRAL_ACTION_MENU_NAME as NAME } from "./constants";
import ReferralAction from "./referral-action";

const ReferralActionMenu = ({ transition, recordType }) => {
  const i18n = useI18n();
  const [referralMenu, setReferralMenu] = useState(null);
  const [referralType, setReferralType] = useState(DONE);

  const { pending, dialogOpen, dialogClose, setDialog, setDialogPending } = useDialog(REFERRAL_DONE_DIALOG);

  const setReferralOpen = () => {
    setDialog({ dialog: REFERRAL_DONE_DIALOG, open: true });
  };

  const handleReferralMenuClose = () => {
    setReferralMenu(null);
  };

  const handleDoneOpen = event => {
    event.stopPropagation();
    handleReferralMenuClose();
    setReferralType(DONE);
    setReferralOpen(true);
  };

  const handleReferralMenuClick = event => {
    event.stopPropagation();
    setReferralMenu(event.currentTarget);
  };

  return (
    <>
      <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={handleReferralMenuClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={referralMenu}
        keepMounted
        open={Boolean(referralMenu)}
        onClose={handleReferralMenuClose}
      >
        <MenuItem key={DONE} selected={false} onClick={handleDoneOpen} disabled={false}>
          {i18n.t("buttons.done")}
        </MenuItem>
      </Menu>

      <ReferralAction
        openReferralDialog={dialogOpen}
        close={dialogClose}
        recordId={transition.record_id}
        pending={pending}
        setPending={setDialogPending}
        transistionId={transition.id}
        recordType={recordType}
        dialogName={REFERRAL_DONE_DIALOG}
        referralType={referralType}
      />
    </>
  );
};

ReferralActionMenu.displayName = NAME;

ReferralActionMenu.propTypes = {
  recordType: PropTypes.string,
  transition: PropTypes.object
};

export default ReferralActionMenu;
