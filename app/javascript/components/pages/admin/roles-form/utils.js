import { fromJS } from "immutable";

import { RECORD_TYPES } from "../../../../config";

import {
  AssociatedAgenciesForm,
  AssociatedFormSectionsForm,
  AssociatedRolesForm,
  ResourcesForm,
  RolesMainForm
} from "./forms";

export const getFormsToRender = ({
  primeroModules,
  systemPermissions,
  roles,
  agencies,
  roleActions,
  agencyActions,
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
      AssociatedRolesForm(roles, roleActions, i18n, formMode),
      AssociatedAgenciesForm(agencies, agencyActions, i18n, formMode),
      ResourcesForm(
        systemPermissions
          .get("resource_actions", fromJS({}))
          .filterNot((v, k) => ["role", "agency"].includes(k)),
        i18n,
        formMode
      ),
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
