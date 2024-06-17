// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/display-name, react/no-multi-comp */
import { memo } from "react";
import { useDispatch, batch } from "react-redux";
import PropTypes from "prop-types";
import { cx } from "@emotion/css"
import { Draggable } from "react-beautiful-dnd";

import { SUBFORM_SECTION } from "../../../../../form";
import {
  clearSelectedField,
  clearSelectedSubformField,
  setSelectedField,
  setSelectedSubform,
  setSelectedSubformField,
  updateSelectedField,
  updateSelectedSubform
} from "../../action-creators";
import { setDialog } from "../../../../../action-dialog";
import { useI18n } from "../../../../../i18n";
import SwitchInput from "../../../../../form/fields/switch-input";
import DragIndicator from "../../../forms-list/components/drag-indicator";
import { getFieldsAttribute, getLabelTypeField } from "../utils";
import css from "../fields-list/styles.css";
import { ADMIN_FIELDS_DIALOG } from "../field-dialog/constants";
import { setInitialForms, toggleHideOnViewPage } from "../field-dialog/utils";
import { useApp } from "../../../../../application";
import FieldListColumn from "../field-list-column";
import FieldListName from "../field-list-name";

import { NAME, SUBFORM_GROUP_BY, SUBFORM_SORT_BY } from "./constants";

function Component({ field, formMethods, index, subformField, subformSortBy, subformGroupBy }) {
  const dispatch = useDispatch();
  const i18n = useI18n();
  const { limitedProductionSite } = useApp();
  const isNested = Boolean(subformField?.toSeq()?.size);
  const parentFieldName = subformField?.get("name", "");
  const fieldsAttribute = getFieldsAttribute(isNested);
  const fieldName = field.get("name");
  const visibleFieldName = `${fieldsAttribute}.${fieldName}.visible`;
  const { getValues } = formMethods;

  const onNested = () => {
    dispatch(clearSelectedSubformField());
    const currentFormData = getValues({ nest: true });
    const subformData = setInitialForms(currentFormData.subform_section);

    if (subformData) {
      dispatch(updateSelectedSubform(subformData));
      dispatch(
        updateSelectedField({
          [parentFieldName]: {
            ...toggleHideOnViewPage(currentFormData[parentFieldName]),
            disabled: !currentFormData[parentFieldName].disabled
          }
        })
      );
    }
    dispatch(setSelectedSubformField(fieldName));
  };

  const handleClick = () => {
    batch(() => {
      dispatch(setDialog({ dialog: ADMIN_FIELDS_DIALOG, open: true }));
      if (isNested) {
        onNested(fieldName);
      } else {
        const fieldData = getValues({ nest: true })[fieldsAttribute][fieldName];

        dispatch(clearSelectedField());
        dispatch(setSelectedField(fieldName));
        if (fieldData.subform_section_temp_id !== field.get("subform_section_temp_id")) {
          delete fieldData.subform_section_temp_id;
        }
        dispatch(updateSelectedField({ [fieldName]: fieldData }));
      }

      if (field?.get("type") === SUBFORM_SECTION) {
        const selectedSubformParams = {
          id: field.get("subform_section_id") || field.get("subform_section_temp_id"),
          isSubformNew:
            typeof field.get("subform_section_id") === "undefined" || Object.is(field.get("subform_section_id"), null)
        };

        dispatch(setSelectedSubform(selectedSubformParams));
      }
    });
  };

  const isNotEditable = field.get("editable") === false;

  const indicatorColumnClasses = cx([css.fieldColumn, css.dragIndicatorColumn]);
  const fieldNameClasses = cx([css.fieldColumn, css.fieldName]);
  const fieldShowClasses = cx([css.fieldColumn, css.fieldShow]);

  const visibleFieldNames = getValues()[visibleFieldName];

  return (
    <Draggable draggableId={fieldName} index={index} isDragDisabled={limitedProductionSite}>
      {provided => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <div className={css.fieldRow} key={fieldName}>
            <div className={indicatorColumnClasses}>
              <DragIndicator {...provided.dragHandleProps} isDragDisabled={limitedProductionSite} />
            </div>
            <div className={fieldNameClasses}>
              <FieldListName field={field} handleClick={handleClick} isNotEditable={isNotEditable} />
            </div>
            <div className={css.fieldColumn}>{i18n.t(`fields.${getLabelTypeField(field)}`)}</div>
            {isNested && (
              <FieldListColumn
                columnName={SUBFORM_SORT_BY}
                fieldName={fieldName}
                formMethods={formMethods}
                limitedProductionSite={limitedProductionSite}
                parentFieldName={parentFieldName}
                checked={subformSortBy === fieldName}
              />
            )}
            {isNested && (
              <FieldListColumn
                columnName={SUBFORM_GROUP_BY}
                fieldName={fieldName}
                formMethods={formMethods}
                limitedProductionSite={limitedProductionSite}
                parentFieldName={parentFieldName}
                checked={subformGroupBy === fieldName}
              />
            )}
            <div className={fieldShowClasses}>
              <SwitchInput
                commonInputProps={{ name: visibleFieldName, disabled: limitedProductionSite || isNotEditable }}
                metaInputProps={{ selectedValue: visibleFieldNames }}
                formMethods={formMethods}
              />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  field: PropTypes.object.isRequired,
  formMethods: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  limitedProductionSite: PropTypes.bool,
  subformField: PropTypes.object,
  subformGroupBy: PropTypes.string,
  subformSortBy: PropTypes.string
};

export default memo(Component);
