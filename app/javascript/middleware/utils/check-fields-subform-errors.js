export default (subformFields, errors) => {
  if (!errors.length) {
    return subformFields;
  }

  // There are errors, we need to exclude subformFields with errors to avoid
  // creating subformFields without subform_section_id
  return subformFields.reduce((acc, subform) => {
    if (subform.type === "subform" && !("subform_section_id" in subform)) {
      return acc;
    }

    return [...acc, subform];
  }, []);
};
