// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default ({ filterState, fieldName, serviceField, setFieldValue }) => {
  if (filterState?.filtersChanged && !filterState?.userIsSelected && fieldName.endsWith(serviceField)) {
    setFieldValue(fieldName, null, false);
  }
};
