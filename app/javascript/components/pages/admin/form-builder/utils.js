export const convertToFieldsObject = fields =>
  fields
    .map(field => ({ [field.name]: field }))
    .reduce((acc, value) => ({ ...acc, ...value }), {});

export const convertToFieldsArray = fields =>
  Object.keys(fields).map(key => ({ name: key, ...fields[key] }));
