// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useCallback } from "react";
import PropTypes from "prop-types";

import SubformField from "../../../record-form/form/subforms";
import { RECORD_TYPES_PLURAL } from "../../../../config";
import { useI18n } from "../../../i18n";

import { NAME, INDIVIDUAL_VICTIMS, INDIVIDUAL_MULTIPLE_VIOLATIONS } from "./constants";

function Component({ recordType, formSections, values }) {
  const i18n = useI18n();
  const subformMode = { isNew: false, isEdit: false, isShow: true };
  const recordTypePlural = RECORD_TYPES_PLURAL[recordType];
  const individualVictimsData = values?.[INDIVIDUAL_VICTIMS]?.filter(
    victims => victims?.[INDIVIDUAL_MULTIPLE_VIOLATIONS]
  );
  const entryFilter = useCallback(subformData => subformData?.[INDIVIDUAL_MULTIPLE_VIOLATIONS] === true, []);

  if (!individualVictimsData?.length) return null;

  const parentSubform = formSections.find(form => form.unique_id === INDIVIDUAL_VICTIMS);
  const fieldSubform = parentSubform.fields.find(field => field.name === INDIVIDUAL_VICTIMS);
  const nestedSubform = fieldSubform.subform_section_id;

  return (
    <SubformField
      recordType={recordTypePlural}
      mode={subformMode}
      forms={formSections}
      form={parentSubform}
      field={fieldSubform}
      formSection={nestedSubform}
      entryFilter={entryFilter}
      customTitle={i18n.t("incidents.summary_mrm.fields.children_multiple_violation.label")}
    />
  );
}

Component.displayName = NAME;

Component.propTypes = {
  formSections: PropTypes.object.isRequired,
  recordType: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired
};

export default Component;
