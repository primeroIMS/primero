import generateKey from "../../charts/table-values/utils";
import { APPROVALS, CREATE_ACTION, SUBFORM, EXCLUDED_LOG_ACTIONS } from "../constants";

import getTranslatedValue from "./get-translated-value";
import getFieldAndValuesTranslations, { filterFieldsRecordInformation } from "./get-field-and-values-translations";

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
  const { fieldDisplayName, fieldValueFrom, fieldValueTo } = getFieldAndValuesTranslations(
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
      subform_name: fieldDisplayName
    });

    return {
      title: updatedSubform,
      onClick: () => handleSeeDetails({ value, subformName: fieldDisplayName, commonProps })
    };
  }

  const name = filterFieldsRecordInformation(field)?.length
    ? fieldDisplayName || i18n.translations.en.record_information[field]
    : fieldDisplayName || field;

  return {
    change: {
      name,
      from: getTranslatedValue(fieldValueFrom, dateIncludeTime, i18n),
      to: getTranslatedValue(fieldValueTo, dateIncludeTime, i18n)
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

    if (EXCLUDED_LOG_ACTIONS.includes(log.action)) {
      return [...acc];
    }

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
        if (Object.keys(change)[0] === "id" || EXCLUDED_LOG_ACTIONS.includes(Object.keys(change)[0])) {
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
