import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";

import { VIOLATIONS_SUBFORM_UNIQUE_IDS, VIOLATION_FORMS_MAPPING, RECORD_TYPES_PLURAL } from "../../../../config";
import { parseExpression } from "../../../../libs/expressions";
import SubformField from "../../../record-form/form/subforms";

import { NAME } from "./constants";

const Component = ({ recordType, formSections, values }) => {
  const subformMode = { isNew: false, isEdit: false, isShow: true };
  const recordTypePlural = RECORD_TYPES_PLURAL[recordType];

  return VIOLATIONS_SUBFORM_UNIQUE_IDS.map(uniqueID => {
    const subFormWrapper = VIOLATION_FORMS_MAPPING[uniqueID];
    const parentSubform = formSections.find(form => form.unique_id === subFormWrapper);

    if (!parentSubform) {
      return null;
    }
    const fieldSubform = parentSubform.fields.find(field => field.name === uniqueID);

    if (
      !isEmpty(fieldSubform.display_conditions_record) &&
      !parseExpression(fieldSubform.display_conditions_record).evaluate(values)
    ) {
      return null;
    }

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
  recordType: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired
};

export default Component;
