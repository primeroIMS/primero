/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";

import NAMESPACE from "./namespace";

const filter = (changeLogs, fieldNames) => {
  return changeLogs.reduce((acc, elem) => {
    const recordChanges = elem.get("record_changes");
    const hasChanges = recordChanges
      .flatMap(change => Object.keys(change))
      .some(key => fieldNames.some(fieldName => fieldName === key));

    if (hasChanges) {
      const fieldChanges = recordChanges.filter(change =>
        fieldNames.some(fieldName => fieldName === Object.keys(change)[0])
      );

      return acc.push(elem.set("record_changes", fieldChanges));
    }

    return acc;
  }, fromJS([]));
};

export const getChangeLogs = (state, id, recordType, recordForms, filters) => {
  const changeLogs = state
    .getIn(["records", NAMESPACE, "data"], fromJS([]))
    .filter(log => log.record_type === recordType && log.record_id === id);

  const formUniqueIds = filters?.get("form_unique_ids", fromJS([]));
  const fieldNames = filters?.get("field_names", fromJS([]));

  if (formUniqueIds?.size) {
    const formFieldNames = recordForms
      .filter(form => formUniqueIds.includes(form.unique_id))
      .flatMap(form => form.fields.map(field => field.name));

    return filter(changeLogs, formFieldNames);
  }

  if (fieldNames?.size) {
    return filter(changeLogs, fieldNames);
  }

  return changeLogs.size ? changeLogs : fromJS([]);
};
