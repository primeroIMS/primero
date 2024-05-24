// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

export default (state, subform) =>
  fromJS(
    subform
      ?.get("fields")
      ?.map(fieldId => state.getIn(["fields", fieldId.toString()]))
      ?.map(field =>
        field.set("on_collapsed_subform", subform.get("collapsed_field_names", fromJS([])).includes(field.get("name")))
      )
  );
