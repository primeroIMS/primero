import { fromJS } from "immutable";

import { RECORD_TYPES } from "../../../../../config";
import { FieldRecord, FormSectionRecord, RADIO_FIELD, LABEL_FIELD } from "../../../../form";
import { displayNameHelper } from "../../../../../libs";
import { ROLES_PERMISSIONS } from "../constants";

const builFields = (recordType, formsByParentForm, i18n) => {
  const formSectionRows = formsByParentForm
    .map(form => {
      const formName = form.get("name");

      return {
        customRowStyle: true,
        row: [
          FieldRecord({
            display_name: displayNameHelper(formName, i18n.locale),
            name: `label-${formName}`,
            type: LABEL_FIELD
          }),
          FieldRecord({
            name: `form_section_unique_ids.${recordType}.${form.unique_id}`,
            type: RADIO_FIELD,
            visible: true,
            option_strings_text: {
              [i18n.locale]: [
                {
                  id: ROLES_PERMISSIONS.hide.text,
                  label: ""
                },
                {
                  id: ROLES_PERMISSIONS.read.text,
                  label: ""
                },
                {
                  id: ROLES_PERMISSIONS.read_write.text,
                  label: ""
                }
              ]
            }
          })
        ]
      };
    })
    .toJS();

  return formSectionRows;
};

export default (formSections, i18n) =>
  [RECORD_TYPES.cases, RECORD_TYPES.tracing_requests, RECORD_TYPES.incidents].map(recordType =>
    FormSectionRecord({
      unique_id: `associated_form_sections_${recordType}`,
      name: i18n.t(`permissions.resource.forms.${recordType}.label`),
      tooltip: i18n.t(`permissions.resource.forms.${recordType}.explanation`),
      expandable: true,
      expanded: true,
      fields: [
        {
          row: [
            FieldRecord({
              display_name: "Hide",
              name: "hide",
              type: LABEL_FIELD
            }),
            FieldRecord({
              display_name: "Read",
              name: "read",
              type: LABEL_FIELD
            }),
            FieldRecord({
              display_name: "Read and write",
              name: "read and write",
              type: LABEL_FIELD
            })
          ]
        },
        ...builFields(recordType, formSections.get(recordType, fromJS({})).valueSeq(), i18n)
      ]
    })
  );
