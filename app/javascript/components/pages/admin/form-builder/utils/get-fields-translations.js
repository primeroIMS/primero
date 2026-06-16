export default fields =>
  Object.keys(fields)
    .map(key => ({ [key]: { display_name: { en: fields[key].display_name?.en } } }))
    .reduce((acc, elem) => ({ ...acc, ...elem }), {});
