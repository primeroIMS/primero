import { MATCH_REPORTABLE_TYPES } from "../constants";

import buildFields from "./build-fields";
import getFormName from "./get-form-name";

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

  const reportableForm = formName
    ? formsByModuleAndRecordType
        .filter(formSection => formSection.get("unique_id") === formName)
        ?.getIn([0, "fields"])
        // eslint-disable-next-line camelcase
        ?.find(field => field.type === "subform")?.subform_section_id
    : [];

  return buildFields(
    formName ? reportableForm : recordTypesForms,
    i18n,
    Boolean(formName),
    reportingLocationConfig,
    reportableFieldsByRecord
  );
};
