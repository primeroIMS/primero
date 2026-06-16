import isEqual from "lodash/isEqual";

export const isFieldInList = (field, fieldList) => fieldList.some(fieldItem => isEqual(field, fieldItem));

export const buildSelectedFieldList = selectedFields =>
  selectedFields.reduce((prev, current) => [...prev, { id: current.get("id"), name: current.get("name") }], []);

export const buildExistingFields = (selectedFieldList, addedFields, removedFields) =>
  selectedFieldList.concat(addedFields).filter(field => !isFieldInList(field, removedFields));

export const getExistingFieldNames = existingFields => existingFields.map(existingField => existingField.name);

export const removeFieldFromList = (removedField, fieldList) =>
  fieldList.filter(field => !isEqual(field, removedField));
