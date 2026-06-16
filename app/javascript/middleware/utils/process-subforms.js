import checkFieldSubformErrors from "./check-fields-subform-errors";

export default (callback, responses) => {
  const {
    api: {
      body: {
        data: { fields }
      }
    }
  } = callback;
  const subforms = responses.filter(({ value }) => value.ok).map(({ value }) => value.json.data);
  const errors = responses
    .filter(({ value }) => !value.ok)
    .map(({ value }) => value.json.errors)
    .flat();

  const updatedSubformFields = fields.map(field => {
    const foundSubform = subforms.find(
      subform => "unique_id" in subform && subform.unique_id === field.subform_section_unique_id
    );

    return foundSubform && typeof field.subform_section_id === "undefined"
      ? {
          ...field,
          subform_section_id: foundSubform.id
        }
      : field;
  });

  return {
    ...callback,
    api: {
      ...callback.api,
      body: {
        ...callback.api.body,
        data: {
          ...callback.api.body.data,
          fields: checkFieldSubformErrors(updatedSubformFields, errors)
        }
      }
    }
  };
};
