import { fromJS } from "immutable";

import { RECORD_TYPES } from "../../../../../config";
import {
  FieldRecord,
  FormSectionRecord,
  CHECK_BOX_FIELD
} from "../../../../form";

export default (formSections, i18n) => {
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
