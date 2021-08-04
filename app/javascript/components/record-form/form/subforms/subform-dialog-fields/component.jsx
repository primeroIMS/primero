import PropTypes from "prop-types";
import { connect } from "formik";

import FormSectionField from "../../form-section-field";
import { fieldsToRender } from "../subform-field-array/utils";

import { NAME } from "./constants";

const Component = ({
  mode,
  index,
  filterFunc,
  filterState,
  setFilterState,
  field,
  formSection,
  isReadWriteForm,
  recordModuleID,
  recordType
}) => {
  const { subform_section_configuration: subformSectionConfiguration } = field;

  const { fields: listFieldsToRender } = subformSectionConfiguration || {};

  const fieldsToDisplay = fieldsToRender(listFieldsToRender, field.subform_section_id.fields);

  return fieldsToDisplay.map(subformSectionField => {
    const fieldProps = {
      name: subformSectionField.name,
      field: subformSectionField,
      mode:
        field.disabled || isReadWriteForm === false
          ? {
              isShow: true,
              isEdit: false,
              isNew: false
            }
          : mode,
      index,
      parentField: field,
      filters:
        filterFunc && filterState && setFilterState
          ? {
              values: filterFunc(field, subformSectionField),
              filterState,
              setFilterState
            }
          : {},
      disabled: subformSectionField.disabled || field.disabled || isReadWriteForm === false,
      formSection,
      isReadWriteForm,
      recordModuleID,
      recordType
    };

    return (
      <div key={subformSectionField.name}>
        <FormSectionField {...fieldProps} />
      </div>
    );
  });
};

Component.displayName = NAME;

Component.defaultProps = {
  isParentFieldDisabled: false
};

Component.propTypes = {
  field: PropTypes.object.isRequired,
  filterFunc: PropTypes.func,
  filterState: PropTypes.object,
  formSection: PropTypes.object.isRequired,
  index: PropTypes.number,
  isReadWriteForm: PropTypes.bool,
  mode: PropTypes.object.isRequired,
  recordModuleID: PropTypes.string,
  recordType: PropTypes.string,
  setFilterState: PropTypes.func
};

export default connect(Component);
