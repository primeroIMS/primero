import { fromJS } from "immutable";

import { RECORD_TYPES } from "../../../../../config";
import { FieldRecord, FormSectionRecord, RADIO_FIELD, LABEL_FIELD } from "../../../../form";
import { displayNameHelper } from "../../../../../libs";
import { ROLES_PERMISSIONS } from "../constants";

const buildHeader = (id, i18n) => {
  return {
    unique_id: `${id}-header`,
    customHeaderStyle: true,
    row: [
      FieldRecord({
        display_name: "",
        name: "permission",
        type: LABEL_FIELD
      }),
      {
        unique_id: `${id}-header-role-permissions`,
        row: Object.keys(ROLES_PERMISSIONS).map(rolePermission =>
          FieldRecord({
            display_name: i18n.t(`role.${rolePermission}`),
            name: rolePermission,
            type: LABEL_FIELD
          })
        )
      }
    ]
  };
};

const buildFields = (recordType, formsByParentForm, i18n) => {
  const formSectionRows = formsByParentForm
    .map(form => {
      const formName = displayNameHelper(form.get("name"), i18n.locale);

      return {
        unique_id: `${form.get("unique_id")}-fields`,
        customRowStyle: true,
        row: [
          FieldRecord({
            display_name: formName,
            name: `label-${form.get("unique_id")}`,
            type: LABEL_FIELD
          }),
          FieldRecord({
            name: `form_section_read_write.${recordType}.${form.unique_id}`,
            type: RADIO_FIELD,
            visible: true,
            disabled: form.core_form,
            option_strings_text: {
              [i18n.locale]: [
                ROLES_PERMISSIONS.hide.text,
                ROLES_PERMISSIONS.read.text,
                ROLES_PERMISSIONS.read_write.text
              ].map(rolePermissionText => ({ id: rolePermissionText, label: "" }))
            }
          })
        ]
      };
    })
    .toJS();

  return formSectionRows;
};

export default (formSections, i18n) =>
  [RECORD_TYPES.cases, RECORD_TYPES.tracing_requests, RECORD_TYPES.incidents].map(recordType => {
    const uniqueID = `associated_form_sections_${recordType}`;

    return FormSectionRecord({
      unique_id: uniqueID,
      name: i18n.t(`permissions.resource.forms.${recordType}.label`),
      tooltip: i18n.t(`permissions.resource.forms.${recordType}.explanation`),
      expandable: true,
      expanded: true,
      fields: [
        buildHeader(uniqueID, i18n),
        ...buildFields(recordType, formSections.get(recordType, fromJS({})).valueSeq(), i18n)
      ]
    });
  });
