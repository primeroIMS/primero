import { RECORD_TYPES } from "../../../../../config";
import { fetchTransferUsers } from "../../action-creators";
import { internalFieldsDirty } from "../helpers";

import {
  AGENCY_FIELD,
  LOCATION_FIELD,
  TRANSITIONED_TO_FIELD
} from "./constants";

export default (dispatch, field, form, setDisabled, recordType) => {
  if (
    internalFieldsDirty(form.values, [
      AGENCY_FIELD,
      LOCATION_FIELD,
      TRANSITIONED_TO_FIELD
    ])
  ) {
    dispatch(fetchTransferUsers({ record_type: RECORD_TYPES[recordType] }));
  }
  setDisabled(!field.value);
  form.setFieldValue(field.name, !field.value, false);
};
