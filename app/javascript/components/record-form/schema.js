import { normalize, schema, denormalize } from "normalizr";

const field = new schema.Entity("fields", {});

const formSection = new schema.Entity("formSections", {
  fields: [field]
});

field.define({
  subform_section_id: formSection
});

export const normalizeData = data => normalize(data, [formSection]);

export const denormalizeData = (key, enitities) => {
  return denormalize(key, [formSection], enitities);
};
