import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import differenceWith from "lodash/differenceWith";
import intersection from "lodash/intersection";

import { FIELDS } from "../record-owner/constants";
import { compactValues } from "../record-form/utils";
import generateKey from "../charts/table-values/utils";

import { APPROVALS, CREATE_ACTION, EMPTY_VALUE, TYPE, SUBFORM } from "./constants";

const getValueFromOptions = (allLookups, locations, i18n, optionSelected, value) => {
  const valueToTranslated = typeof value === "boolean" ? value.toString() : value;

  if (optionSelected === "Location") {
    return locations
      .filter(location => location.get("code") === valueToTranslated)
      ?.first()
      ?.get("name")
      ?.get(i18n.locale);
  }

  return allLookups
    ?.find(lookup => lookup.get("unique_id") === optionSelected.replace(/lookup /, ""))
    ?.get("values")
    ?.find(v => v.get("id") === valueToTranslated)
    ?.get("display_text")
    ?.get(i18n.locale);
};

const getFieldValueFromOptionSource = (allLookups, locations, i18n, selectedFieldOptionsSource, fieldValue) => {
  if (Array.isArray(fieldValue)) {
    return fieldValue.map(valueFrom =>
      getValueFromOptions(allLookups, locations, i18n, selectedFieldOptionsSource, valueFrom)
    );
  }

  return getValueFromOptions(allLookups, locations, i18n, selectedFieldOptionsSource, fieldValue);
};

const getFieldValueFromOptionText = (i18n, selectedFieldOptionsText, fieldValue) => {
  const valueTranslated = value =>
    selectedFieldOptionsText?.find(
      optionStringText => optionStringText.id === value
      // eslint-disable-next-line camelcase
    )?.display_text[i18n.locale];

  if (Array.isArray(fieldValue)) {
    return fieldValue.map(value => valueTranslated(value));
  }

  return valueTranslated(fieldValue);
};

const addedDeletedCompare = (currFrom, currTo) => currFrom.unique_id === currTo.unique_id;

const getDiffFromEditedSubform = (valueFrom, valueTo) => {
  const fromIds = valueFrom?.map(val => val.unique_id) || [];
  const toIds = valueTo?.map(val => val.unique_id) || [];
  const editedSubformsIds = intersection(fromIds, toIds);

  return editedSubformsIds.reduce((acc, subform) => {
    const currFromSubform = valueFrom.find(val => val.unique_id === subform);
    const currToSubform = valueTo.find(val => val.unique_id === subform);

    if (isEqual(currFromSubform, currToSubform)) {
      return acc;
    }

    const uniqueId = { unique_id: { from: currFromSubform.unique_id, to: currFromSubform.unique_id } };
    const differences = Object.entries(compactValues(currFromSubform, currToSubform)).reduce(
      (accum, curr) => ({ ...accum, [curr[0]]: { from: curr[1], to: currToSubform[curr[0]] } }),
      {}
    );

    return [
      ...acc,
      {
        ...uniqueId,
        ...differences
      }
    ];
  }, []);
};

const getFieldsAndValuesTranslations = (allLookups, locations, i18n, selectedField, field, value) => {
  let fieldDisplayName;
  let fieldValueFrom = value.from;
  let fieldValueTo = value.to;

  if (field === APPROVALS) {
    fieldDisplayName = i18n.t("forms.record_types.approvals");
  }
  const fieldRecordInformation = FIELDS.filter(fieldInformation => fieldInformation.name === field);

  if (fieldRecordInformation.length) {
    fieldDisplayName = i18n.t(`record_information.${field}`);
  }

  if (selectedField) {
    fieldDisplayName = selectedField?.get("display_name")[i18n.locale];
  }

  const selectedFieldOptionsSource = selectedField?.get("option_strings_source");
  const selectedFieldOptionsText = selectedField?.get("option_strings_text");

  if (selectedFieldOptionsSource) {
    fieldValueFrom = getFieldValueFromOptionSource(
      allLookups,
      locations,
      i18n,
      selectedFieldOptionsSource,
      fieldValueFrom
    );
    fieldValueTo = getFieldValueFromOptionSource(allLookups, locations, i18n, selectedFieldOptionsSource, fieldValueTo);
  }

  if (selectedFieldOptionsText) {
    fieldValueFrom = getFieldValueFromOptionText(i18n, selectedFieldOptionsText, fieldValueFrom);
    fieldValueTo = getFieldValueFromOptionText(i18n, selectedFieldOptionsText, fieldValueTo);
  }

  return {
    fieldDisplayName,
    fieldValueFrom,
    fieldValueTo
  };
};

const generateUpdateMessage = (
  fieldRecord,
  field,
  value,
  commonProps,
  allLookups,
  locations,
  handleSeeDetails,
  i18n
) => {
  const fieldsTranslated = getFieldsAndValuesTranslations(allLookups, locations, i18n, fieldRecord, field, value);

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
    title: i18n.t("change_logs.change", {
      field_name: fieldsTranslated.fieldDisplayName || field,
      from_value: isNil(fieldsTranslated.fieldValueFrom) ? EMPTY_VALUE : fieldsTranslated.fieldValueFrom,
      to_value: isNil(fieldsTranslated.fieldValueTo) ? EMPTY_VALUE : fieldsTranslated.fieldValueTo
    })
  };
};

const getSubformChanges = (valueFrom, valueTo) => ({
  updated: getDiffFromEditedSubform(valueFrom, valueTo),
  added: differenceWith(valueTo, valueFrom, addedDeletedCompare),
  deleted: differenceWith(valueFrom, valueTo, addedDeletedCompare)
});

const getCurrentValue = changes => {
  const uniqueId = changes[changes.valueToRender];

  return uniqueId.substr(uniqueId.length - 7);
};

const generateFieldDetails = (type, subformName, log, allFields, allLookups, locations, i18n) =>
  Object.entries(log).reduce(
    (acc, curr) => {
      const [fieldName, fieldChanges] = curr;

      const currentChanges = {
        [TYPE.added]: { from: EMPTY_VALUE, to: fieldChanges, valueToRender: "to", title: "change_logs.add_subform" },
        [TYPE.deleted]: {
          from: fieldChanges,
          to: EMPTY_VALUE,
          valueToRender: "from",
          title: "change_logs.deleted_subform"
        },
        [TYPE.updated]: { ...fieldChanges, valueToRender: "to", title: "change_logs.updated_subform" }
      }[type];

      if (fieldName === "unique_id") {
        acc.title = i18n.t(currentChanges.title, {
          subform_name: subformName,
          short_id: getCurrentValue(currentChanges)
        });

        return acc;
      }

      const fieldRecord = allFields.filter(recordField => recordField.name === fieldName)?.first();

      const fieldsTranslated = getFieldsAndValuesTranslations(
        allLookups,
        locations,
        i18n,
        fieldRecord,
        fieldName,
        currentChanges
      );

      if (type !== TYPE.deleted) {
        acc.details = [
          ...acc.details,
          i18n.t("change_logs.change", {
            field_name: fieldsTranslated.fieldDisplayName || fieldName,
            from_value: fieldsTranslated.fieldValueFrom || EMPTY_VALUE,
            to_value: fieldsTranslated.fieldValueTo || EMPTY_VALUE
          })
        ];
      }

      return acc;
    },
    { title: "", details: [] }
  );

export const getDataItems = (recordChangeLogs, allFields, allLookups, locations, handleSeeDetails, i18n) => {
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

    const updateMessages = log.record_changes.map(change => {
      const fieldName = Object.keys(change)[0];
      const fieldChanges = Object.values(change)[0];

      const fieldRecord = allFields.filter(recordField => recordField.name === fieldName)?.first();
      const updateProps = generateUpdateMessage(
        fieldRecord,
        fieldName,
        fieldChanges,
        commonProps,
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

export const getSubformDataItems = (recordChanges, allFields, allLookups, locations, i18n) => {
  const result = Object.entries(getSubformChanges(recordChanges.value.from, recordChanges.value.to)).reduce(
    (acc, subformLog) => {
      const [type, logs] = subformLog;

      if (isEmpty(logs)) {
        return acc;
      }

      const logItem = logs.reduce((accum, changes) => {
        return [
          ...accum,
          {
            key: `subfom-log-${generateKey()}`,
            ...recordChanges.commonProps,
            ...generateFieldDetails(type, recordChanges?.subformName, changes, allFields, allLookups, locations, i18n)
          }
        ];
      }, []);

      return [...acc, ...logItem];
    },
    []
  );

  return result;
};
