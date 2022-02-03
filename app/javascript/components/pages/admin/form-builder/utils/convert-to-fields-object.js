export default fields =>
  fields.map(field => ({ [field.name]: field })).reduce((acc, value) => ({ ...acc, ...value }), {});
