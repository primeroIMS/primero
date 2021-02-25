import { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import FlagIcon from "@material-ui/icons/Flag";

import { useDialog } from "../action-dialog";
import { useI18n } from "../i18n";
import ActionButton from "../action-button";
import { ACTION_BUTTON_TYPES } from "../action-button/constants";

import { FlagForm, ListFlags, FlagDialog, Unflag } from "./components";
import { fetchFlags } from "./action-creators";
import { NAME, FLAG_DIALOG } from "./constants";
import { getSelectedFlag } from "./selectors";

const Component = ({ control, record, recordType }) => {
  const [tab, setTab] = useState(0);
  const i18n = useI18n();
  const { dialogOpen, setDialog } = useDialog(FLAG_DIALOG);

  const isBulkFlags = Array.isArray(record);

  const selectedFlag = useSelector(state => getSelectedFlag(state));

  const handleOpen = () => {
    setDialog({ dialog: FLAG_DIALOG, open: true });
  };

  const handleActiveTab = value => {
    setTab(value);
  };

  const flagFormProps = {
    recordType,
    record,
    handleActiveTab
  };

  const flagDialogProps = {
    isBulkFlags,
    dialogOpen,
    tab,
    setTab,
    fetchAction: fetchFlags,
    fetchArgs: [recordType, record]
  };

  const listFlagsProps = {
    recordType,
    record
  };

  return (
    <>
      {(control && <control onClick={handleOpen} />) || (
        <ActionButton
          icon={<FlagIcon />}
          text={i18n.t("buttons.flags")}
          type={ACTION_BUTTON_TYPES.default}
          rest={{
            onClick: handleOpen
          }}
        />
      )}
      <FlagDialog {...flagDialogProps}>
        <div hidetab={isBulkFlags.toString()}>
          <ListFlags {...listFlagsProps} />
        </div>
        <div>
          <FlagForm {...flagFormProps} />
        </div>
      </FlagDialog>
      <Unflag flag={selectedFlag} />
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  control: PropTypes.node,
  record: PropTypes.string,
  recordType: PropTypes.string.isRequired,
  showActionButtonCss: PropTypes.string
};

export default Component;
