import generateKey from "../../charts/table-values/utils";
import { APPROVALS, CREATE_ACTION, SUBFORM } from "../constants";

import getTranslatedValue from "./get-translated-value";
import getFieldAndValuesTranslations from "./get-field-and-values-translations";

const generateUpdateMessage = (
  fieldRecord,
  field,
  value,
  commonProps,
  allAgencies,
  allLookups,
  locations,
  handleSeeDetails,
  i18n
) => {
  const fieldsTranslated = getFieldAndValuesTranslations(
    allAgencies,
    allLookups,
    locations,
    i18n,
    fieldRecord,
    field,
    value
  );
  const dateIncludeTime = fieldRecord?.get("date_include_time");

  if (fieldRecord?.get("type") === SUBFORM || field === APPROVALS) {
    const updatedSubform = i18n.t("change_logs.update_subform", {
      subform_name: fieldsTranslated.fieldDisplayName
    });

    return {
      title: updatedSubform,
      onClick: () => handleSeeDetails({ value, subformName: fieldsTranslated.fieldDisplayName, commonProps })
    };
  }

  return {
    change: {
      name: fieldsTranslated.fieldDisplayName || field,
      from: getTranslatedValue(fieldsTranslated.fieldValueFrom, dateIncludeTime, i18n),
      to: getTranslatedValue(fieldsTranslated.fieldValueTo, dateIncludeTime, i18n)
    }
  };
};

export default (recordChangeLogs, allFields, allAgencies, allLookups, locations, handleSeeDetails, i18n) => {
  if (!recordChangeLogs.size) {
    return [];
  }

  const result = recordChangeLogs.valueSeq().reduce((acc, log) => {
    const commonProps = {
      date: log.datetime,
      user: log.user_name
    };

    if (log.action === CREATE_ACTION) {
      return [
        ...acc,
        {
          ...commonProps,
          key: generateKey(),
          title: i18n.t("change_logs.create")
        }
      ];
    }

    const updateMessages = log.record_changes
      .filter(change => {
        if (Object.keys(change)[0] === "id") {
          return false;
        }

        return true;
      })
      .map(change => {
        const fieldName = Object.keys(change)[0];
        const fieldChanges = Object.values(change)[0];

        const fieldRecord = allFields.filter(recordField => recordField.name === fieldName)?.first();
        const updateProps = generateUpdateMessage(
          fieldRecord,
          fieldName,
          fieldChanges,
          commonProps,
          allAgencies,
          allLookups,
          locations,
          handleSeeDetails,
          i18n
        );

        return {
          ...commonProps,
          ...updateProps,
          key: generateKey(),
          isSubform: fieldRecord?.get("type") === SUBFORM || fieldName === APPROVALS
        };
      });

    return [...acc, ...updateMessages];
  }, []);

  return result;
};
