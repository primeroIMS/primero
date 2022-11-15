import { fieldArrayToConditions } from "../../../utils";

export default (data, fieldName) => {
  const dataToSave = { ...data };

  if (dataToSave[fieldName]?.display_conditions_record) {
    dataToSave[fieldName].display_conditions_record = fieldArrayToConditions(
      dataToSave[fieldName].display_conditions_record
    );
  }

  if (dataToSave[fieldName]?.display_conditions_subform) {
    dataToSave[fieldName].display_conditions_subform = fieldArrayToConditions(
      dataToSave[fieldName].display_conditions_subform
    );
  }

  return dataToSave;
};
