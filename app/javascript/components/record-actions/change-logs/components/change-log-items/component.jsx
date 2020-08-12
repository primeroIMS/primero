import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { useI18n } from "../../../../i18n";
import { getFields } from "../../../../record-form";
import { getOptions, getLocations } from "../../../../record-form/selectors";
import { compare } from "../../../../../libs";
import ChangeLogItem from "../change-log-item";
import { getFieldsAndValuesTranslations } from "../../utils";
import { APPROVALS } from "../../constants";

import { NAME, CREATE_ACTION, EMPTY_VALUE } from "./constants";

const Component = ({ recordChangeLogs }) => {
  const i18n = useI18n();
  const allFields = useSelector(state => getFields(state), compare);
  const allLookups = useSelector(state => getOptions(state), compare);
  const locations = useSelector(state => getLocations(state));

  const renderUpdateMessage = (fieldRecord, field, value) => {
    const fieldsTranslated = getFieldsAndValuesTranslations(allLookups, locations, i18n, fieldRecord, field, value);

    if (fieldRecord?.get("type") === "subform" || field === APPROVALS) {
      return i18n.t("change_logs.update_subform", {
        subform_name: fieldsTranslated.fieldDisplayName
      });
    }

    return i18n.t("change_logs.update", {
      field_name: fieldsTranslated.fieldDisplayName,
      from_value: fieldsTranslated.fieldValueFrom || EMPTY_VALUE,
      to_value: fieldsTranslated.fieldValueTo || EMPTY_VALUE
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
        return <ChangeLogItem {...commonProps} changeLogMessage={i18n.t("change_logs.create")} />;
      }

      return log.record_changes.map(change => {
        const fieldName = Object.keys(change)[0];
        const fieldChanges = Object.values(change)[0];

        const fieldRecord = allFields.filter(recordField => recordField.name === fieldName)?.first();

        return (
          <ChangeLogItem
            {...commonProps}
            changeLogMessage={renderUpdateMessage(fieldRecord, fieldName, fieldChanges)}
          />
        );
      });
    });

  return renderItems;
};

Component.displayName = NAME;

Component.propTypes = {
  recordChangeLogs: PropTypes.object
};

export default Component;
