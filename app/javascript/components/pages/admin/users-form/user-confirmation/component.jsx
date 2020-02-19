import React, { useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { FormLabel, TextField } from "@material-ui/core";

import { useI18n } from "../../../../i18n";
import { ActionDialog } from "../../../../action-dialog";
import { saveUser } from "../action-creators";

import { NAME } from "./constants";

const Component = ({
  close,
  dialogName,
  id,
  pending,
  saveMethod,
  setPending,
  userConfirmationOpen,
  userData
}) => {
  const i18n = useI18n();
  const dispatch = useDispatch();

  const handleOk = () => {
    setPending(true);

    dispatch(
      saveUser({
        id,
        saveMethod,
        dialogName,
        body: { userData },
        message: i18n.t(
          `user.messages.${ saveMethod === "update" ? "updated" : "created"}`
        ),
        failureMessage:i18n.t("user.messages.failure")
      })
    );
  };

  const successButtonProps = {
    color: "primary",
    variant: "contained",
    autoFocus: true
  };

  const dialogContent = (
    <p>{i18n.t(`user.messages.${saveMethod}_confirm`, {username: userData.user_name, identity: userData.identity_provider, role: userData.role_unique_id, email: userData.email})}</p>
  );

  return (
    <ActionDialog
      open={userConfirmationOpen}
      successHandler={handleOk}
      cancelHandler={close}
      dialogTitle=""
      pending={pending}
      omitCloseAfterSuccess
      confirmButtonLabel={i18n.t("buttons.ok")}
      confirmButtonProps={successButtonProps}
      onClose={close}
    >
      {dialogContent}
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  userConfirmationOpen: false
};

Component.propTypes = {
  close: PropTypes.func,
  dialogName: PropTypes.string,
  id: PropTypes.string,
  pending: PropTypes.bool,
  saveMethod: PropTypes.string,
  setPending: PropTypes.func,
  userConfirmationOpen: PropTypes.bool,
  userData: PropTypes.object
};

export default Component;
