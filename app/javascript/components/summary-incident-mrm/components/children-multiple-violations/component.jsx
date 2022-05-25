import { useCallback } from "react";
import PropTypes from "prop-types";

import SubformField from "../../../record-form/form/subforms";
import { RECORD_TYPES_PLURAL } from "../../../../config";
import { useI18n } from "../../../i18n";

import { NAME, INDIVIDUAL_VICTIMS } from "./constants";

const Component = ({ record, recordType, formSections }) => {
  const i18n = useI18n();
  const subformMode = { isNew: false, isEdit: false, isShow: true };
  const recordTypePlural = RECORD_TYPES_PLURAL[recordType];
  const individualVictimsData = record?.get(INDIVIDUAL_VICTIMS)?.filter(id => id.get("individual_multiple_violations"));
  const entryFilter = useCallback(subformData => subformData?.individual_multiple_violations === true, []);

  if (!individualVictimsData.size) return null;

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
};

Component.displayName = NAME;

Component.propTypes = {
  formSections: PropTypes.object.isRequired,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired
};

export default Component;
