export default subform => {
  if (subform) {
    return {
      ...subform,
      initial_subforms: subform.starts_with_one_entry ? 1 : 0
    };
  }

  return subform;
};
