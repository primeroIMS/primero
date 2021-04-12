import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import { useI18n } from "../i18n";
import ActionDialog from "../action-dialog";
import { getSavingRecord } from "../records";
import { useMemoizedSelector } from "../../libs";
import { setSelectedForm } from "../record-form";

import { SAVE_AND_REDIRECT_DIALOG } from "./constants";

const Component = ({
  setSaveCaseBeforeRedirect,
  closeRedirectDialog,
  handleSubmit,
  mode,
  open,
  setFieldValue,
  incidentPath,
  recordType
}) => {
  const i18n = useI18n();
  const dispatch = useDispatch();

  const savingRecord = useMemoizedSelector(state => getSavingRecord(state, recordType));

  if (!open || mode.isShow) {
    return null;
  }

  const handleSuccessAction = () => {
    setFieldValue("incidentPath", incidentPath);
    setSaveCaseBeforeRedirect(true);
    dispatch(setSelectedForm(""));
    handleSubmit();
  };

  const handleSuccessClick = () => handleSuccessAction();

  if (!open && !mode.isShow) {
    return false;
  }

  return (
    <ActionDialog
      open
      successHandler={handleSuccessClick}
      cancelHandler={closeRedirectDialog}
      dialogTitle={i18n.t("case.save")}
      dialogText={i18n.t("case.save_text")}
      confirmButtonLabel={i18n.t("buttons.save_continue")}
      pending={savingRecord}
    />
  );
};

Component.displayName = SAVE_AND_REDIRECT_DIALOG;

Component.defaultProps = {
  incidentPath: "new"
};

Component.propTypes = {
  closeRedirectDialog: PropTypes.func,
  handleSubmit: PropTypes.func,
  incidentPath: PropTypes.string,
  mode: PropTypes.object.isRequired,
  open: PropTypes.bool,
  recordType: PropTypes.string,
  setFieldValue: PropTypes.func,
  setSaveCaseBeforeRedirect: PropTypes.func
};
export default Component;
