import React from "react";
import PropTypes from "prop-types";
import Timeline from "@material-ui/lab/Timeline";
import { useSelector } from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";

import { useI18n } from "../../i18n";
import ActionDialog from "../../action-dialog";
import { getFields } from "../../record-form";
import { compare } from "../../../libs";
import { FIELDS } from "../../record-owner/constants";

import { NAME, CREATE_ACTION } from "./constants";
import { getChangeLogs } from "./selectors";
import styles from "./styles.css";
import ChangeLogItem from "./components/change-log-item";

const Component = ({ close, openChangeLog, record, recordType }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const recordChangeLogs = useSelector(state =>
    getChangeLogs(state, record?.get("id"), recordType)
  );
  const fields = useSelector(state => getFields(state), compare);

  const getFieldDisplayName = field => {
    if (field === "approval_subforms") {
      return i18n.t("forms.record_types.approvals");
    }
    const fieldRecordInformation = FIELDS.filter(
      fieldInformation => fieldInformation.name === field
    );

    if (fieldRecordInformation.length) {
      return i18n.t(`record_information.${field}`);
    }

    const selectedField = fields.filter(
      recordField => recordField.name === field
    );

    return selectedField?.first()?.get("display_name")[i18n.locale];
  };

  const renderUpdateMessage = (field, value) => {
    const fieldDisplayName = getFieldDisplayName(field);

    return i18n.t("change_logs.update", {
      field_name: fieldDisplayName,
      from_value: value.from || "--",
      to_value: value.to || ""
    });
  };

  const renderItems =
    Boolean(recordChangeLogs.size) &&
    recordChangeLogs.valueSeq().map(log => {
      const commonProps = {
        changeLogDate: log.datetime,
        changeLogUser: log.user_name
      };

      if (log.action === CREATE_ACTION) {
        return (
          <ChangeLogItem
            {...commonProps}
            changeLogMessage={i18n.t("change_logs.create")}
          />
        );
      }

      return log.record_changes.map(change => {
        const fieldName = Object.keys(change)[0];
        const fieldChanges = Object.values(change)[0];

        return (
          <ChangeLogItem
            {...commonProps}
            changeLogMessage={renderUpdateMessage(fieldName, fieldChanges)}
          />
        );
      });
    });

  return (
    <ActionDialog
      open={openChangeLog}
      onClose={close}
      cancelHandler={close}
      disableActions
      dialogTitle={i18n.t("actions.change_log")}
    >
      <Timeline classes={{ root: css.root }}>{renderItems}</Timeline>
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
