import { fromJS } from "immutable";

import { RECORD_TYPES } from "../../../../config";

import {
  form,
  roleForms,
  agencyForms,
  resourcesForm,
  formSectionsForm
} from "./form";

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
      form(
        primeroModules,
        systemPermissions.get("management", fromJS([])),
        i18n,
        formMode
      ),
      roleForms(roles, roleActions, i18n, formMode),
      agencyForms(agencies, agencyActions, i18n, formMode),
      resourcesForm(
        systemPermissions
          .get("resource_actions", fromJS({}))
          .filterNot((v, k) => ["role", "agency"].includes(k)),
        i18n,
        formMode
      ),
      formSectionsForm(formSections, i18n, formMode)
    ].flat()
  );

export const mergeFormSections = data => {
  const recordTypes = [
    RECORD_TYPES.cases,
    RECORD_TYPES.tracing_requests,
    RECORD_TYPES.incidents
  ];

  if (!data.form_section_unique_ids) {
    return data;
  }

  const formSectionUniqueIds = recordTypes
    .map(recordType => data.form_section_unique_ids[recordType])
    .flat();

  return { ...data, form_section_unique_ids: formSectionUniqueIds };
};
