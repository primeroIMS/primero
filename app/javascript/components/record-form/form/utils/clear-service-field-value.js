export default ({ filterState, fieldName, serviceField, setFieldValue }) => {
  if (filterState?.filtersChanged && !filterState?.userIsSelected && fieldName.endsWith(serviceField)) {
    setFieldValue(fieldName, null, false);
  }
};
