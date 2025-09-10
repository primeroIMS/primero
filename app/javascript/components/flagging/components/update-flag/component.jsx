// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import ActionDialog, { useDialog } from "../../../action-dialog";
import { useI18n } from "../../../i18n";
import { FLAG_DIALOG } from "../../constants";
import FlagForm from "../flag-form";

import { FORM_ID, UPDATE_FLAG_DIALOG } from "./constants";

function Component({ flag, record, recordType }) {
  const i18n = useI18n();
  const { dialogOpen, setDialog, dialogPending } = useDialog(UPDATE_FLAG_DIALOG);

  const handleReset = () => {
    setDialog({ dialog: FLAG_DIALOG, open: true, pending: false });
  };

  return (
    <ActionDialog
      open={dialogOpen}
      maxSize="sm"
      dialogTitle={i18n.t("flags.update_flag")}
      confirmButtonLabel={i18n.t("buttons.save")}
      cancelHandler={handleReset}
      pending={dialogPending}
      omitCloseAfterSuccess
      confirmButtonProps={{
        form: FORM_ID,
        type: "submit"
      }}
    >
      <FlagForm flag={flag} record={record} recordType={recordType} formId={FORM_ID} />
    </ActionDialog>
  );
}

Component.displayName = "UpdateFlag";

Component.propTypes = {
  flag: PropTypes.object.isRequired,
  record: PropTypes.string.isRequired,
  recordType: PropTypes.string.isRequired
};

export default Component;
