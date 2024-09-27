// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import ActionDialog from "../../../action-dialog";
import { useI18n } from "../../../i18n";
import { getSavingNewPasswordReset } from "../../../pages/admin/users-form/selectors";
import { useMemoizedSelector } from "../../../../libs";
import PasswordResetForm from "../password-reset-form";

import { NAME, FORM_ID } from "./constants";

function Component({ open = false, handleCancel, handleSuccess }) {
  const i18n = useI18n();
  const saving = useMemoizedSelector(state => getSavingNewPasswordReset(state));

  const successButtonProps = {
    color: "primary",
    variant: "contained",
    autoFocus: true,
    form: FORM_ID,
    type: "submit"
  };

  return (
    <ActionDialog
      open={open}
      cancelHandler={handleCancel}
      dialogTitle={i18n.t("login.password_reset_modal")}
      pending={saving}
      omitCloseAfterSuccess
      confirmButtonLabel={i18n.t("buttons.ok")}
      confirmButtonProps={successButtonProps}
      onClose={handleCancel}
    >
      <PasswordResetForm handleSubmit={handleSuccess} modal />
    </ActionDialog>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  handleCancel: PropTypes.func,
  handleSuccess: PropTypes.func,
  open: PropTypes.bool
};

export default Component;
