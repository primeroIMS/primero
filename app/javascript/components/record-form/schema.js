import { normalize, schema, denormalize } from "normalizr";

const field = new schema.Entity("fields", {}, { idAttribute: "name" });

const formSection = new schema.Entity("formSections", {
  fields: [field]
});

field.define({
  subform_section: formSection
});

export const normalizeData = data => normalize(data, [formSection]);

export const denormalizeData = (key, enitities) => {
  return denormalize(key, [formSection], enitities);
};
