import PropTypes from "prop-types";
import { connect } from "formik";
import isEmpty from "lodash/isEmpty";

import { parseExpression } from "../../../../../libs/expressions";
import FormSectionField from "../../form-section-field";
import { fieldsToRender } from "../subform-field-array/utils";
import { SUBFORM_SECTION } from "../../../constants";
import SubformField from "../component";
import css from "../styles.css";

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
  parentTitle,
  parentValues,
  recordModuleID,
  recordType,
  values
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

    if (
      (!isEmpty(subformSectionField.display_conditions_record) &&
        !parseExpression(subformSectionField.display_conditions_record).evaluate(parentValues)) ||
      (!isEmpty(subformSectionField.display_conditions_subform) &&
        !parseExpression(subformSectionField.display_conditions_subform).evaluate(values))
    ) {
      return null;
    }

    if (SUBFORM_SECTION === subformSectionField.type) {
      return (
        <div className={css.subFormField}>
          <SubformField
            parentTitle={parentTitle}
            {...{ ...fieldProps, formSection: subformSectionField.subform_section_id, isReadWriteForm, forms: {} }}
          />
        </div>
      );
    }

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
  parentTitle: PropTypes.string,
  parentValues: PropTypes.object,
  recordModuleID: PropTypes.string,
  recordType: PropTypes.string,
  setFilterState: PropTypes.func,
  values: PropTypes.object
};

export default connect(Component);
