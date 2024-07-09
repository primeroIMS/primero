// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

export default (subform, fieldName, selectedSubformField = fromJS({})) => {
  if (selectedSubformField.size > 0) {
    return true;
  }

  if (!subform?.toSeq()?.size) {
    return false;
  }

  return Boolean(
    subform
      ?.get("fields")
      ?.find(field => field.get("name") === fieldName)
      ?.toSeq()?.size
  );
};
