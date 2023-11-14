// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default (data, selectedField, newFieldName, lastFieldOrder) => {
  const type = selectedField.get("type");
  const order = lastFieldOrder ? lastFieldOrder + 1 : 0;
  const multiSelect = {
    multi_select: Boolean(selectedField.get("multi_select"))
  };
  const dateIncludeTime = {
    date_include_time: Boolean(selectedField.get("date_include_time"))
  };

  return {
    ...data,
    type,
    name: newFieldName,
    order,
    ...multiSelect,
    ...dateIncludeTime
  };
};
