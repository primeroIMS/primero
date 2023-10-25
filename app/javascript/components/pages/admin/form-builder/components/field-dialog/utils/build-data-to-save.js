// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { SEPARATOR } from "../../../../../../form";
import { NEW_FIELD } from "../../../constants";

import appendSettingsAttributes from "./append-settings-attributes";
import generateUniqueId from "./generate-unique-id";
import isSubformField from "./is-subform-field";
import transformValues from "./transform-values";

export default (selectedField, data, lastFieldOrder, randomSubformId) => {
  const fieldName = selectedField?.get("name");
  const newData = transformValues(
    { ...data, disabled: selectedField?.get("type") === SEPARATOR ? true : data?.disabled },
    true
  );

  if (fieldName !== NEW_FIELD) {
    return { [fieldName]: newData };
  }
  const newFieldName = generateUniqueId(newData.display_name.en);

  const dataToSave = appendSettingsAttributes(newData, selectedField, newFieldName, lastFieldOrder);

  return {
    [newFieldName]:
      isSubformField(selectedField) && fieldName === NEW_FIELD
        ? {
            ...dataToSave,
            subform_section_temp_id: randomSubformId,
            subform_section_unique_id: newFieldName
          }
        : dataToSave
  };
};
