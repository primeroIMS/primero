import { SAVE_METHODS } from "../../../../../config";

import convertToFieldsArray from "./convert-to-fields-array";
import fieldArrayToConditions from "./field-array-to-conditions";
import mergeTranslations from "./merge-translations";

export default ({ id, formData, formMode, i18n }) => {
  const mergedData = mergeTranslations(formData);
  const updatedNewFields = convertToFieldsArray(mergedData.fields || []);
  const displayConditions = fieldArrayToConditions(mergedData.display_conditions || []);
  const body = {
    data: {
      ...mergedData,
      ...(updatedNewFields.length && { fields: updatedNewFields }),
      display_conditions: { ...displayConditions, disabled: !formData.skip_logic }
    }
  };

  return {
    id,
    saveMethod: formMode.get("isEdit") ? SAVE_METHODS.update : SAVE_METHODS.new,
    body,
    message: i18n.t(`forms.messages.${formMode.get("isEdit") ? "updated" : "created"}`)
  };
};
