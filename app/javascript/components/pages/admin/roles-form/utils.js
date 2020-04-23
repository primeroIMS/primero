import { fromJS } from "immutable";

import { RECORD_TYPES } from "../../../../config";
import { ERROR_FIELD, FieldRecord, FormSectionRecord } from "../../../form";

import {
  AssociatedFormSectionsForm,
  ResourcesForm,
  RolesMainForm
} from "./forms";
import { FORM_CHECK_ERRORS } from "./constants";

export const getFormsToRender = ({
  primeroModules,
  systemPermissions,
  roles,
  formSections,
  i18n,
  formMode
}) =>
  fromJS(
    [
      RolesMainForm(
        primeroModules,
        systemPermissions.get("management", fromJS([])),
        i18n,
        formMode
      ),
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
      ResourcesForm(
        systemPermissions.get("resource_actions", fromJS({})),
        roles,
        i18n
      ),
      FormSectionRecord({
        unique_id: "forms_label",
        name: { [i18n.locale]: i18n.t("forms.label") }
      }),
      AssociatedFormSectionsForm(formSections, i18n, formMode)
    ].flat()
  );

export const mergeFormSections = data => {
  const recordTypes = Object.values(RECORD_TYPES).filter(
    type => type !== RECORD_TYPES.all
  );

  if (!data.form_section_unique_ids) {
    return data;
  }

  const formSectionUniqueIds = recordTypes
    .map(recordType => data.form_section_unique_ids[recordType])
    .flat();

  return { ...data, form_section_unique_ids: formSectionUniqueIds };
};

export const groupSelectedIdsByParentForm = (data, assignableForms) => {
  const formSectionUniqueIds = data.get("form_section_unique_ids");

  if (formSectionUniqueIds?.size && assignableForms?.size) {
    const selectedFormsByParentForm = assignableForms
      .filter(assignableForm =>
        formSectionUniqueIds.includes(assignableForm.get("unique_id"))
      )
      .groupBy(assignableForm => assignableForm.get("parent_form"));

    const selectedUniqueIdsByParentForm = selectedFormsByParentForm.mapEntries(
      ([parentForm, formSections]) =>
        fromJS([
          parentForm,
          formSections.valueSeq().map(fs => fs.get("unique_id"))
        ])
    );

    return data.set("form_section_unique_ids", selectedUniqueIdsByParentForm);
  }

  return data;
};
