import { DATE_FIELD_CUSTOM_VALUES } from "../constants";

export default (field, isSubmit) => {
  if (!isSubmit) {
    return DATE_FIELD_CUSTOM_VALUES.date_validation[field.date_validation];
  }

  return Object.entries(DATE_FIELD_CUSTOM_VALUES.date_validation).find(
    obj => obj[1] === Boolean(field.date_validation)
  )?.[0];
};
