// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { MATCH_REPORTABLE_TYPES } from "../constants";

import buildFields from "./build-fields";
import getFormName from "./get-form-name";

function findFieldByName(formSections, fieldName) {
  // eslint-disable-next-line no-restricted-syntax
  for (const formSection of formSections) {
    if (formSection.fields) {
      const result = formSection.fields.find(field => field.name === fieldName);

      if (result) {
        return result;
      }
    }
  }

  return null;
}

function getReportableFormFields(formName, formsByModuleAndRecordType) {
  if (formName) {
    if (formName === "services") {
      return findFieldByName(formsByModuleAndRecordType, "services_section")?.subform_section_id;
    }

    return formsByModuleAndRecordType
      .filter(formSection => formSection.get("unique_id") === formName)
      ?.getIn([0, "fields"])
      ?.find(field => field.type === "subform")?.subform_section_id;
  }

  return [];
}

export default (formSections, modules, recordType, i18n, reportingLocationConfig, reportableFields) => {
  const formsByModuleAndRecordType = formSections.filter(formSection =>
    Array.isArray(modules)
      ? formSection.get("module_ids").some(mod => modules.includes(mod))
      : formSection.get("module_ids").includes(modules)
  );
  const formName = getFormName(recordType);
  const recordTypesForms = formsByModuleAndRecordType.filter(
    formSection => formSection.get("parent_form") === recordType && !formSection.get("is_nested")
  );
  const reportableFieldsByRecord = reportableFields?.[MATCH_REPORTABLE_TYPES?.[recordType]];
  const reportableForm = getReportableFormFields(formName, formsByModuleAndRecordType);

  return buildFields(
    formName ? reportableForm : recordTypesForms,
    i18n,
    Boolean(formName),
    reportingLocationConfig,
    reportableFieldsByRecord
  );
};
