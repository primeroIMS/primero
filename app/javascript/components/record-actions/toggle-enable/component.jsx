import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import { useI18n } from "../../i18n";
import ActionDialog from "../../action-dialog";
import { saveRecord } from "../../records";

import { NAME } from "./constants";

const Component = ({ close, open, record, recordType }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const enableState = record && !record.get("record_state") ? "enable" : "disable";
  const setValue = record ? !record.get("record_state") : true;
  const recordTypeWithStatus = `${recordType}.${enableState}`;

  const handleOk = () => {
    dispatch(
      saveRecord(
        recordType,
        "update",
        {
          data: { record_state: setValue },
          record_action: "enable_disable_record"
        },
        record.get("id"),
        i18n.t(`${recordTypeWithStatus}_success`),
        i18n.t("offline_submitted_changes"),
        false,
        false
      )
    );
    close();
  };

  return (
    <ActionDialog
      open={open}
      successHandler={handleOk}
      cancelHandler={close}
      dialogTitle={i18n.t(`${recordTypeWithStatus}_dialog_title`)}
      dialogText={i18n.t(`${recordTypeWithStatus}_dialog`)}
      confirmButtonLabel={i18n.t("cases.ok")}
    />
  );
};

Component.displayName = NAME;

Component.propTypes = {
  close: PropTypes.func,
  open: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string
};

export default Component;
