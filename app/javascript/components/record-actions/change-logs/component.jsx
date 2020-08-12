import React from "react";
import PropTypes from "prop-types";
import Timeline from "@material-ui/lab/Timeline";
import { useSelector } from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";

import { useI18n } from "../../i18n";
import ActionDialog from "../../action-dialog";

import { NAME } from "./constants";
import { getChangeLogs } from "./selectors";
import styles from "./styles.css";
import ChangeLogItems from "./components/change-log-items";

const Component = ({ close, openChangeLog, record, recordType }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const recordChangeLogs = useSelector(state => getChangeLogs(state, record?.get("id"), recordType));

  return (
    <ActionDialog
      open={openChangeLog}
      onClose={close}
      cancelHandler={close}
      disableActions
      dialogTitle={i18n.t("actions.change_log")}
    >
      <div className={css.container}>
        <Timeline classes={{ root: css.root }}>
          <ChangeLogItems recordChangeLogs={recordChangeLogs} />
        </Timeline>
      </div>
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  close: PropTypes.func,
  openChangeLog: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired
};

export default Component;
