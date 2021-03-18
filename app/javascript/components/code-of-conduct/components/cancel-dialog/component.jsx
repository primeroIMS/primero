import PropTypes from "prop-types";
import { push } from "connected-react-router";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import ActionDialog from "../../../action-dialog";
import { ROUTES } from "../../../../config";

import { NAME } from "./constants";

const Component = ({ dispatch, open, setOpen, i18n }) => {
  const onClose = () => setOpen(false);
  const handleLogout = () => {
    dispatch(push(ROUTES.logout));
  };

  return (
    <ActionDialog
      open={open}
      onClose={onClose}
      cancelHandler={onClose}
      dialogTitle={i18n.t("messages.logout_confirmation_title")}
      dialogText={i18n.t("messages.logout_confirmation_text")}
      successHandler={handleLogout}
      confirmButtonLabel={i18n.t("navigation.logout")}
      confirmButtonProps={{
        icon: <ExitToAppIcon />
      }}
    />
  );
};

Component.displayName = NAME;

Component.propTypes = {
  dispatch: PropTypes.func,
  i18n: PropTypes.object,
  open: PropTypes.bool,
  setOpen: PropTypes.func
};

export default Component;
