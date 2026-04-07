import { convertToFieldsObject } from "../../../utils";

export default subform => {
  const subformData = subform.toJS();

  return {
    subform_section: {
      ...subformData,
      starts_with_one_entry: Boolean(subform.initial_subforms),
      fields: convertToFieldsObject(subformData.fields)
    }
  };
};
