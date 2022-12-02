import { fieldArrayToConditions } from "../../../utils";

export default data => {
  const dataToSave = { ...data };

  if (dataToSave.display_conditions_record) {
    dataToSave.display_conditions_record = fieldArrayToConditions(dataToSave.display_conditions_record);
  }

  if (dataToSave.display_conditions_subform) {
    dataToSave.display_conditions_subform = fieldArrayToConditions(dataToSave.display_conditions_subform);
  }

  return dataToSave;
};
