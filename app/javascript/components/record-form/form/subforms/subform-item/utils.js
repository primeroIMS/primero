import { FormSectionRecord, FieldRecord } from "../../../records";

import { ORDER_OF_FORMS, VIOLATION_TALLY, VIOLATIONS_FIELDS } from "./constants";

/* eslint-disable import/prefer-default-export */
export const buildFormViolations = (violationField, forms) => {
  if (!forms.size > 0) return {};

  const violationFields = violationField.subform_section_id.fields;

  const formFields = forms
    .flatMap(field => field.get("fields"))
    .filter(field => field.get("type") === "subform")
    .groupBy(field => field.name)
    .valueSeq()
    .map(field => field.first());

  const violationTally = violationFields.filter(field => field.name === VIOLATION_TALLY);
  const otherViolationsFields = violationFields.filter(field => field.name !== VIOLATION_TALLY);

  const fields = ORDER_OF_FORMS.reduce((acc, curr) => {
    if (curr === VIOLATION_TALLY) return [...acc, ...violationTally];
    if (curr === VIOLATIONS_FIELDS) return [...acc, ...otherViolationsFields];

    const subformField = formFields.find(field => field.name === curr);

    if (!subformField) return acc;

    return [...acc, subformField];
  }, []);

  return FieldRecord({ name: violationField.name, subform_section_id: FormSectionRecord({ fields }) });
};
