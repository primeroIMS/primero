import React from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { useI18n } from "../../../../i18n";
import { ActionDialog } from "../../../../action-dialog";
import { saveUser } from "../action-creators";

import { NAME } from "./constants";

const Component = ({
  close,
  dialogName,
  id,
  isIdp,
  pending,
  saveMethod,
  setPending,
  userConfirmationOpen,
  userData,
  userName,
  identityOptions,
  roleOptions
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
        body: { data: userData },
        message: i18n.t("user.messages.created"),
        failureMessage: i18n.t("user.messages.failure")
      })
    );
  };

  const successButtonProps = {
    color: "primary",
    variant: "contained",
    autoFocus: true
  };
  const identity = identityOptions.find(currentIdentity =>
    currentIdentity.id === userData.identity_provider_id
  );
  const role = roleOptions.find(currentRole =>
    currentRole.id === userData.role_unique_id
  );

  const dialogContent = (
    <p
      dangerouslySetInnerHTML={{
        __html: i18n.t(`user.messages.new_confirm_${isIdp ? "" : "non_identity_"}html`, {
          username: userName,
          identity: identity?.display_text,
          role: role?.display_text,
          email: userData.email
        })
      }}
    />
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
  identityOptions: PropTypes.object,
  isIdp: PropTypes.bool,
  pending: PropTypes.bool,
  roleOptions: PropTypes.object,
  saveMethod: PropTypes.string,
  setPending: PropTypes.func,
  userConfirmationOpen: PropTypes.bool,
  userData: PropTypes.object,
  userName: PropTypes.string
};

export default Component;
