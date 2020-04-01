import { fetchTransferUsers } from "../../action-creators";
import { RECORD_TYPES } from "../../../../../config";
import { getInternalFields } from "../helpers";

export default (data, field, form, queryValues, recordType, dispatch) => {
  const { value } = data;

  form.setFieldValue(field.name, value, false);

  if (queryValues) {
    const result = getInternalFields(form.values, queryValues);
    const params = {
      record_type: RECORD_TYPES[recordType],
      [field.name]: value,
      ...result
    };

    if (value !== form.values[field.name]) {
      dispatch(fetchTransferUsers(params));
    }
  }
};
