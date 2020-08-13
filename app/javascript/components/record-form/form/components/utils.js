/* eslint-disable import/prefer-default-export */
export const removeEmptyArrays = object =>
  Object.entries(object)
    .filter(([, value]) => (Array.isArray(value) ? value.length > 0 : true))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
