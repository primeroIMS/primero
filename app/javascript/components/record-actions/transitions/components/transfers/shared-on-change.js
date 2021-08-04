import { fetchTransferUsers } from "../../action-creators";
import { RECORD_TYPES } from "../../../../../config";
import { getInternalFields } from "../utils";

export default (data, field, form, queryValues, recordType, recordModuleID, dispatch) => {
  const { value } = data || { value: "" };

  form.setFieldValue(field.name, value, false);

  if (queryValues) {
    const result = getInternalFields(form.values, queryValues);
    const params = {
      record_type: RECORD_TYPES[recordType],
      record_module_id: recordModuleID,
      [field.name]: value,
      ...result
    };

    if (value !== form.values[field.name]) {
      dispatch(fetchTransferUsers(params));
    }
  }
};
