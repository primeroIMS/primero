// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "formik";
import isEmpty from "lodash/isEmpty";

import { parseExpression } from "../../../../../libs/expressions";
import FormSectionField from "../../form-section-field";
import { fieldsToRender } from "../subform-field-array/utils";
import { SUBFORM_SECTION } from "../../../constants";
import { buildViolationOptions, getOptionStringsTags, getViolationIdsForAssociations } from "../../utils";
import { useI18n } from "../../../../i18n";
import uuid from "../../../../../libs/uuid";
import displayConditionsEnabled from "../../utils/display-conditions-enabled";
import getDisplayConditions from "../../utils/get-display-conditions";

import { NAME, VIOLATION_IDS_NAME } from "./constants";

function Component({
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
  values,
  components
}) {
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
      // eslint-disable-next-line camelcase
      const parentUniqueId = parentValues?.unique_id;

      if (!isEmpty(values[VIOLATION_IDS_NAME]) || parentUniqueId) {
        const violationIdsValues = getViolationIdsForAssociations(
          field.name,
          values[VIOLATION_IDS_NAME],
          parentUniqueId
        );

        setFieldValue(VIOLATION_IDS_NAME, violationIdsValues);
      }
    }
  }, []);

  return fieldsToDisplay.map(subformSectionField => {
    const calculationExpression = subformSectionField?.calculation?.expression;

    if (calculationExpression) {
      const calculatedVal = parseExpression(calculationExpression).evaluate(values);

      if (values[subformSectionField.name] !== calculatedVal) {
        setFieldValue(subformSectionField.name, calculatedVal);
      }
    }

    const tags = getOptionStringsTags(subformSectionField, values).concat(
      getOptionStringsTags(subformSectionField, parentValues)
    );

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
            values: filterFunc(values, field, subformSectionField),
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
      (displayConditionsEnabled(subformSectionField.display_conditions_record) &&
        !parseExpression(getDisplayConditions(subformSectionField.display_conditions_record)).evaluate(parentValues)) ||
      (displayConditionsEnabled(subformSectionField.display_conditions_subform) &&
        !parseExpression(getDisplayConditions(subformSectionField.display_conditions_subform)).evaluate(values))
    ) {
      return null;
    }

    if (SUBFORM_SECTION === subformSectionField.type) {
      return (
        <components.SubformFieldSubform
          components={{
            SubformField: components.SubformField
          }}
          fieldProps={fieldProps}
          isViolation={isViolation}
          parentTitle={parentTitle}
          parentValues={parentValues}
          violationOptions={violationOptions}
        />
      );
    }

    return (
      <div key={subformSectionField.name} data-testid="subform-dialog-field">
        <FormSectionField {...fieldProps} />
      </div>
    );
  });
}

Component.displayName = NAME;

Component.propTypes = {
  components: PropTypes.objectOf({
    SubformFieldSubform: PropTypes.elementType.isRequired
  }),
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
  parentValues: PropTypes.object.isRequired,
  parentViolationOptions: PropTypes.array,
  recordModuleID: PropTypes.string,
  recordType: PropTypes.string,
  setFieldValue: PropTypes.func,
  setFilterState: PropTypes.func,
  values: PropTypes.object.isRequired
};

export default connect(Component);
