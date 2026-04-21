export default (field, subform) => {
  if (subform) {
    return {
      ...field,
      display_name: subform?.name
    };
  }

  return field;
};
