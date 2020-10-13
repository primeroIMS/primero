import React from "react";
import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";
import ActionDialog from "../../../action-dialog";
import { REDIRECT_DIALOG } from "../../constants";

const Component = ({ handleSubmit, mode, open, setFieldValue, setOpen, incidentPath }) => {
  const i18n = useI18n();

  if (!open || mode.isShow) {
    return null;
  }

  const handleCloseAction = () => {
    setOpen(false);
  };

  const handleSuccessAction = () => {
    setFieldValue("incidentPath", incidentPath);
    handleSubmit();
  };

  return (
    <ActionDialog
      open
      successHandler={() => handleSuccessAction()}
      cancelHandler={handleCloseAction}
      dialogTitle={i18n.t("case.save")}
      dialogText={i18n.t("case.save_text")}
      confirmButtonLabel={i18n.t("buttons.save_continue")}
    />
  );
};

Component.displayName = REDIRECT_DIALOG;

Component.defaultProps = {
  incidentPath: "new"
};

Component.propTypes = {
  handleSubmit: PropTypes.func,
  incidentPath: PropTypes.string,
  mode: PropTypes.object,
  open: PropTypes.bool,
  setFieldValue: PropTypes.func,
  setOpen: PropTypes.func
};
export default Component;
