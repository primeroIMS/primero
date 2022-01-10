import { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "formik";
import isEmpty from "lodash/isEmpty";
import uuid from "uuid";

import { parseExpression } from "../../../../../libs/expressions";
import FormSectionField from "../../form-section-field";
import { fieldsToRender } from "../subform-field-array/utils";
import { SUBFORM_SECTION } from "../../../constants";
import SubformField from "../component";
import css from "../styles.css";
import { buildViolationOptions, getOptionStringsTags } from "../../utils";
import { useI18n } from "../../../../i18n";

import { NAME, VIOLATION_IDS_NAME } from "./constants";

const Component = ({
  mode,
  index,
  filterFunc,
  filterState,
  setFilterState,
  field,
  formSection,
  isReadWriteForm,
  isViolation,
  isViolationAssociation,
  parentTitle,
  parentValues,
  parentViolationOptions,
  recordModuleID,
  recordType,
  setFieldValue,
  values
}) => {
  const i18n = useI18n();
  const { subform_section_configuration: subformSectionConfiguration } = field;

  const { fields: listFieldsToRender } = subformSectionConfiguration || {};

  const fieldsToDisplay = fieldsToRender(listFieldsToRender, field.subform_section_id.fields);
  const violationOptions = buildViolationOptions(
    parentValues,
    field.name,
    parentTitle,
    isViolation,
    i18n,
    // eslint-disable-next-line camelcase
    values?.unique_id
  );

  useEffect(() => {
    if (isViolation && !mode.isShow && !values.unique_id) {
      setFieldValue("unique_id", uuid.v4());
    }
    if (isViolationAssociation && !mode.isShow) {
      const violationIdsValues = isEmpty(values[VIOLATION_IDS_NAME])
        ? // eslint-disable-next-line camelcase
          [parentValues?.unique_id]
        : values[VIOLATION_IDS_NAME];

      setFieldValue(VIOLATION_IDS_NAME, violationIdsValues);
    }
  }, []);

  return fieldsToDisplay.map(subformSectionField => {
    const tags = getOptionStringsTags(subformSectionField, values);
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
      ...(filterFunc &&
        filterState &&
        setFilterState && {
          filters: {
            values: filterFunc(field, subformSectionField),
            filterState,
            setFilterState
          }
        }),
      disabled: subformSectionField.disabled || field.disabled || isReadWriteForm === false,
      formSection,
      isReadWriteForm,
      recordModuleID,
      recordType,
      ...(subformSectionField.name === VIOLATION_IDS_NAME && {
        violationOptions: parentViolationOptions || violationOptions
      }),
      ...(isEmpty(tags) ? {} : { tags })
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
            {...{
              ...fieldProps,
              formSection: subformSectionField.subform_section_id,
              isReadWriteForm,
              forms: {},
              parentTitle,
              parentValues,
              violationOptions
            }}
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
  isViolation: PropTypes.bool,
  isViolationAssociation: PropTypes.bool,
  mode: PropTypes.object.isRequired,
  parentTitle: PropTypes.string,
  parentValues: PropTypes.object,
  parentViolationOptions: PropTypes.array,
  recordModuleID: PropTypes.string,
  recordType: PropTypes.string,
  setFieldValue: PropTypes.func,
  setFilterState: PropTypes.func,
  values: PropTypes.object
};

export default connect(Component);
