import React from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";
import { ActionDialog } from "../../../action-dialog";

import { referralDone } from "./action-creators";
import { NAME } from "./constants";

const Component = ({
  openReferralDialog,
  close,
  recordId,
  recordType,
  transistionId
}) => {

  const i18n = useI18n();
  const dispatch = useDispatch();

  const handleCancel = (event) => {
    if (event) {
      event.stopPropagation();
    }

    close();
  };

  const stopProp = event => {
    event.stopPropagation();
  };

  const handleOk = () => {
    dispatch(
      referralDone({
        message: i18n.t(`${recordType}.referral_done_success`),
        recordId,
        recordType,
        transistionId
      })
    );

    close();
  };

  const successButtonProps = {
    color: "primary",
    variant: "contained",
    autoFocus: true
  };

  const dialogContent = <p>{i18n.t(`${recordType}.referral_done`)}</p>;

  return (
    <ActionDialog
      open={openReferralDialog}
      successHandler={handleOk}
      cancelHandler={handleCancel}
      dialogTitle=""
      confirmButtonLabel={i18n.t("buttons.done")}
      confirmButtonProps={successButtonProps}
      onClose={close}
    >
      {dialogContent}
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  openReferralDialog: false
};

Component.propTypes = {
  openReferralDialog: PropTypes.bool,
  close: PropTypes.func,
  recordId: PropTypes.string,
  recordType: PropTypes.string,
  transistionId: PropTypes.string
};

export default Component;
