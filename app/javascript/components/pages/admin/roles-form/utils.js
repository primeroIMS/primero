import { fromJS, Map } from "immutable";

import { RECORD_TYPES } from "../../../../config";
import { ERROR_FIELD, FieldRecord, FormSectionRecord } from "../../../form";

import { AssociatedFormSectionsForm, ResourcesForm, RolesMainForm } from "./forms";
import { FORM_CHECK_ERRORS, ROLES_PERMISSIONS } from "./constants";

const getFormPermission = permission => {
  switch (permission) {
    case ROLES_PERMISSIONS.read.id:
      return ROLES_PERMISSIONS.read.text;
    case ROLES_PERMISSIONS.read_write.id:
      return ROLES_PERMISSIONS.read_write.text;
    default:
      return ROLES_PERMISSIONS.hide.text;
  }
};

export const getFormsToRender = ({
  systemPermissions,
  formSections,
  i18n,
  formMode,
  approvalsLabels,
  adminLevelMap
}) => {
  return fromJS(
    [
      RolesMainForm(systemPermissions.get("management", fromJS([])), i18n, adminLevelMap),
      FormSectionRecord({
        unique_id: "permissions_label",
        name: { [i18n.locale]: i18n.t("permissions.label") },
        check_errors: fromJS(FORM_CHECK_ERRORS),
        fields: [
          FieldRecord({
            type: ERROR_FIELD,
            check_errors: fromJS(FORM_CHECK_ERRORS)
          })
        ]
      }),
      ResourcesForm(systemPermissions.get("resource_actions", fromJS({})), i18n, approvalsLabels),
      FormSectionRecord({
        unique_id: "forms_label",
        name: { [i18n.locale]: i18n.t("forms.label") }
      }),
      AssociatedFormSectionsForm(formSections, i18n, formMode)
    ].flat()
  );
};

export const mergeFormSections = data => {
  const recordTypes = Object.values(RECORD_TYPES).filter(type => type !== RECORD_TYPES.all);

  if (!data.form_section_read_write) {
    return data;
  }

  const formSectionUniqueIds = recordTypes.reduce((accum, curr) => {
    const formsByRecordType = data.form_section_read_write[curr];

    const result =
      (formsByRecordType &&
        Object.entries(formsByRecordType).reduce((acc, form) => {
          const [key, value] = form;

          if (value === ROLES_PERMISSIONS.hide.text) {
            return acc;
          }

          return { ...acc, [key]: ROLES_PERMISSIONS[value] ? ROLES_PERMISSIONS[value].id : "" };
        }, {})) ||
      {};

    return { ...accum, ...result };
  }, {});

  return { ...data, form_section_read_write: formSectionUniqueIds };
};

export const groupSelectedIdsByParentForm = (data, assignableForms) => {
  const formSectionUniqueIds = data.get("form_section_read_write");

  if (assignableForms?.size) {
    const selectedFormsByParentForm = assignableForms.groupBy(assignableForm => assignableForm.get("parent_form"));

    const selectedUniqueIdsByParentForm = selectedFormsByParentForm.mapEntries(([parentForm, formSections]) =>
      fromJS([
        parentForm,
        formSections.valueSeq().map(fs => {
          const currentPermission = formSectionUniqueIds?.get(fs.get("unique_id")) || ROLES_PERMISSIONS.hide.id;

          return {
            [fs.get("unique_id")]: fs.core_form ? "" : getFormPermission(currentPermission)
          };
        })
      ])
    );

    const initialPermissions = selectedUniqueIdsByParentForm.entrySeq().reduce((acc, [key, value]) => {
      const values = value.reduce((valueAcc, currValue) => {
        const [newKey, newValue] = Object.entries(currValue)[0];

        return valueAcc.set(newKey, newValue);
      }, Map({}));

      return acc.set(key, values);
    }, Map({}));

    return data.set("form_section_read_write", initialPermissions);
  }

  return data;
};
