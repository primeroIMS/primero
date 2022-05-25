import PropTypes from "prop-types";

import { VIOLATIONS_SUBFORM_UNIQUE_IDS, VIOLATION_FORMS_MAPPING, RECORD_TYPES_PLURAL } from "../../../../config";
import SubformField from "../../../record-form/form/subforms";

import { NAME } from "./constants";

const Component = ({ record, recordType, formSections }) => {
  const subformMode = { isNew: false, isEdit: false, isShow: true };
  const recordTypePlural = RECORD_TYPES_PLURAL[recordType];

  return VIOLATIONS_SUBFORM_UNIQUE_IDS.map(uniqueID => {
    if (!record?.get(uniqueID).size) return null;

    const subFormWrapper = VIOLATION_FORMS_MAPPING[uniqueID];
    const parentSubform = formSections.find(form => form.unique_id === subFormWrapper);
    const fieldSubform = parentSubform.fields.find(field => field.name === uniqueID);
    const nestedSubform = fieldSubform.subform_section_id;

    return (
      <SubformField
        recordType={recordTypePlural}
        mode={subformMode}
        forms={formSections}
        form={parentSubform}
        field={fieldSubform}
        formSection={nestedSubform}
      />
    );
  });
};

Component.displayName = NAME;

Component.propTypes = {
  formSections: PropTypes.object.isRequired,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired
};

export default Component;
