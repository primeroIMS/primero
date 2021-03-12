import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { useI18n } from "../../../i18n";
import ActionDialog from "../../../action-dialog";
import { REDIRECT_DIALOG } from "../../constants";
import { getSavingRecord } from "../../../records";

const Component = ({ handleSubmit, mode, open, setFieldValue, setRedirectOpts, incidentPath, recordType }) => {
  const i18n = useI18n();
  const savingRecord = useSelector(state => getSavingRecord(state, recordType));

  if (!open || mode.isShow) {
    return null;
  }

  const handleCloseAction = () => {
    setRedirectOpts({});
  };

  const handleSuccessAction = () => {
    setFieldValue("incidentPath", incidentPath);
    handleSubmit();
  };

  const handleSuccessClick = () => handleSuccessAction();

  return (
    <ActionDialog
      open
      successHandler={handleSuccessClick}
      cancelHandler={handleCloseAction}
      dialogTitle={i18n.t("case.save")}
      dialogText={i18n.t("case.save_text")}
      confirmButtonLabel={i18n.t("buttons.save_continue")}
      pending={savingRecord}
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
  recordType: PropTypes.string,
  setFieldValue: PropTypes.func,
  setRedirectOpts: PropTypes.func
};
export default Component;
