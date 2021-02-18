import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import { useDialog } from "../action-dialog";
import { useI18n } from "../i18n";
import Menu from "../menu";
import PasswordResetConfirmation, { NAME as DIALOG_NAME } from "../password-reset-confirmation";
import { passwordResetRequest } from "../pages/admin/users-form/action-creators";
import { getUseIdentityProvider } from "../login/selectors";
import { useMemoizedSelector } from "../../libs";

import { NAME } from "./constants";

const Component = ({ id }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { setDialog, dialogOpen, dialogClose } = useDialog(DIALOG_NAME);

  const useIdentiyProvider = useMemoizedSelector(state => getUseIdentityProvider(state));

  const handleConfirm = () => {
    dispatch(passwordResetRequest(id));
  };

  const handlePasswordReset = () => {
    setDialog({ dialog: DIALOG_NAME, open: true });
  };

  const actions = [
    {
      name: i18n.t("user.password_reset_request"),
      action: handlePasswordReset,
      visible: !useIdentiyProvider
    }
  ].filter(action => !action.visible === false);

  return (
    <>
      <Menu showMenu actions={actions} />
      {dialogOpen && (
        <PasswordResetConfirmation open={dialogOpen} handleSuccess={handleConfirm} handleCancel={dialogClose} />
      )}
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  id: PropTypes.string.isRequired
};

export default Component;
