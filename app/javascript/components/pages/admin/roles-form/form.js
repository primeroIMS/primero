import { fromJS } from "immutable";
import * as yup from "yup";

import { RECORD_TYPES } from "../../../../config";
import {
  FieldRecord,
  FormSectionRecord,
  TICK_FIELD,
  TEXT_FIELD,
  SELECT_FIELD,
  CHECK_BOX_FIELD
} from "../../../form";

const actionsAsOptions = (actions, i18n) =>
  actions.map(action => ({
    id: action,
    display_text: i18n.t(`permissions.permission.${action}`)
  }));

const permissionFields = (permissions, i18n) =>
  (permissions || fromJS({})).keySeq().map(key =>
    FieldRecord({
      display_name: i18n.t(`permissions.permission.${key}`),
      name: `permissions[${key}]`,
      disabled: true,
      type: CHECK_BOX_FIELD,
      editable: false,
      option_strings_text: actionsAsOptions(permissions.get(key), i18n).toJS()
    })
  );

const groupPermissionOptions = (groupPermissions, i18n) => {
  return (groupPermissions || fromJS([])).map(groupPermission => ({
    id: groupPermission,
    display_text: i18n.t(`permissions.permission.${groupPermission}`)
  }));
};

export const validations = formMode =>
  yup.object().shape({
    name: yup.string().required(),
    permissions: yup
      .object()
      .test("permissions", "permissions is required", async value => {
        const selectedPermissions = { ...value };

        delete selectedPermissions.objects;

        return Object.values(selectedPermissions).flat().length > 0;
      })
  });

export const form = (primeroModules, groupPermissions, i18n, formMode) => {
  return FormSectionRecord({
    unique_id: "roles",
    fields: [
      FieldRecord({
        display_name: i18n.t("role.name"),
        name: "name",
        type: "text_field",
        required: true,
        autoFocus: true
      }),
      FieldRecord({
        display_name: i18n.t("role.description"),
        name: "description",
        type: TEXT_FIELD
      }),
      FieldRecord({
        display_name: i18n.t("role.transfer_label"),
        name: "transfer",
        type: TICK_FIELD
      }),
      FieldRecord({
        display_name: i18n.t("role.referral_label"),
        name: "referral",
        type: TICK_FIELD
      }),
      FieldRecord({
        display_name: i18n.t("primero_modules.label"),
        name: "module_ids",
        type: SELECT_FIELD,
        option_strings_text: primeroModules
          .map(primeroModule => ({
            id: primeroModule.unique_id,
            display_text: primeroModule.name
          }))
          .toJS()
      }),
      FieldRecord({
        display_name: i18n.t("role.group_permission_label"),
        name: "group_permission",
        type: SELECT_FIELD,
        option_strings_text: groupPermissionOptions(
          groupPermissions,
          i18n
        ).toJS()
      })
    ]
  });
};

export const resourcesForm = (resourceActions, i18n, formMode) => {
  return FormSectionRecord({
    unique_id: "resource_actions",
    fields: permissionFields(resourceActions, i18n),
    check_errors: fromJS(["permissions"])
  });
};

export const roleForms = (roles, actions, i18n, formMode) => {
  const formNames = {};

  formNames[`${i18n.locale}`] = i18n.t("permissions.label");

  return [
    FormSectionRecord({
      unique_id: "associated_roles",
      name: formNames,
      fields: [
        FieldRecord({
          display_name: i18n.t("role.role_ids_label"),
          name: "permissions[objects][role]",
          type: SELECT_FIELD,
          multi_select: true,
          option_strings_text: (roles.get("data") || fromJS([]))
            .map(role => ({
              id: role.get("unique_id"),
              display_text: role.get("name")
            }))
            .toJS()
        })
      ]
    }),
    FormSectionRecord({
      unique_id: "role_permissions",
      check_errors: fromJS(["permissions"]),
      fields: [
        FieldRecord({
          display_name: i18n.t(`permissions.permission.role`),
          name: `permissions[role]`,
          type: CHECK_BOX_FIELD,
          option_strings_text: actionsAsOptions(actions, i18n).toJS()
        })
      ]
    })
  ];
};

export const agencyForms = (agencies, actions, i18n, formMode) => {
  return [
    FormSectionRecord({
      unique_id: "associated_agencies",
      fields: [
        FieldRecord({
          display_name: i18n.t("role.agency_ids_label"),
          name: "permissions[objects][agency]",
          type: SELECT_FIELD,
          multi_select: true,
          option_strings_text: agencies
            .map(agency => ({
              id: agency.get("unique_id"),
              display_text: agency.get("name")
            }))
            .toJS()
        })
      ]
    }),
    FormSectionRecord({
      unique_id: "agency_permissions",
      check_errors: fromJS(["permissions"]),
      fields: [
        FieldRecord({
          display_name: i18n.t(`permissions.permission.agency`),
          name: `permissions[agency]`,
          type: CHECK_BOX_FIELD,
          option_strings_text: actionsAsOptions(actions, i18n).toJS()
        })
      ]
    })
  ];
};

export const formSectionsForm = (formSections, i18n, formMode) => {
  const formNames = {};

  formNames[`${i18n.locale}`] = i18n.t("forms.label");

  const recordTypes = [
    RECORD_TYPES.cases,
    RECORD_TYPES.tracing_requests,
    RECORD_TYPES.incidents
  ];

  return FormSectionRecord({
    unique_id: "associated_form_sections",
    name: formNames,
    fields: recordTypes.map(recordType =>
      FieldRecord({
        display_name: i18n.t(`permissions.permission.${recordType}`),
        name: `form_section_unique_ids[${recordType}]`,
        type: CHECK_BOX_FIELD,
        multi_select: true,
        option_strings_text: formSections
          .get(recordType, fromJS({}))
          .valueSeq()
          .map(formSection => ({
            id: formSection.get("unique_id"),
            display_text: formSection.getIn(["name", i18n.locale])
          }))
          .toJS()
      })
    )
  });
};
