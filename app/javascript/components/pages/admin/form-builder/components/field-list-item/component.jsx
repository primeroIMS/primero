/* eslint-disable react/display-name, react/no-multi-comp */
import { memo } from "react";
import { useDispatch, batch } from "react-redux";
import { Controller } from "react-hook-form";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Draggable } from "react-beautiful-dnd";
import { Button, makeStyles, Radio } from "@material-ui/core";
import VpnKeyIcon from "@material-ui/icons/VpnKey";

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
import styles from "../fields-list/styles.css";
import { ADMIN_FIELDS_DIALOG } from "../field-dialog/constants";
import { setInitialForms, toggleHideOnViewPage } from "../field-dialog/utils";
import { displayNameHelper } from "../../../../../../libs";
import { useApp } from "../../../../../application";

import { NAME, SUBFORM_GROUP_BY, SUBFORM_SECTION_CONFIGURATION, SUBFORM_SORT_BY } from "./constants";

const useStyles = makeStyles(styles);

const Component = ({ field, formMethods, index, subformField, subformSortBy, subformGroupBy }) => {
  const css = useStyles();
  const dispatch = useDispatch();
  const i18n = useI18n();
  const { limitedProductionSite } = useApp();
  const isNested = Boolean(subformField?.toSeq()?.size);
  const parentFieldName = subformField?.get("name", "");
  const fieldsAttribute = getFieldsAttribute(isNested);
  const fieldName = field.get("name");
  const visibleFieldName = `${fieldsAttribute}.${fieldName}.visible`;
  const { control, getValues } = formMethods;

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

  const renderFieldName = () => {
    const icon = isNotEditable ? <VpnKeyIcon className={css.rotateIcon} /> : <span />;
    const className = clsx({ [css.editable]: !isNotEditable });

    return (
      <>
        {icon}
        <Button className={className} onClick={handleClick}>
          {displayNameHelper(field.get("display_name"), i18n.locale)}
        </Button>
      </>
    );
  };

  const renderColumn = column => {
    const checked =
      (SUBFORM_SORT_BY === column && subformSortBy === fieldName) ||
      (SUBFORM_GROUP_BY === column && subformGroupBy === fieldName);

    return (
      isNested && (
        <div className={css.fieldColumn}>
          <Controller
            control={control}
            as={<Radio />}
            inputProps={{ value: fieldName }}
            checked={checked}
            name={`${parentFieldName}.${SUBFORM_SECTION_CONFIGURATION}.${column}`}
            disabled={limitedProductionSite}
          />
        </div>
      )
    );
  };

  const indicatorColumnClasses = clsx([css.fieldColumn, css.dragIndicatorColumn]);
  const fieldNameClasses = clsx([css.fieldColumn, css.fieldName]);
  const fieldShowClasses = clsx([css.fieldColumn, css.fieldShow]);

  const visibleFieldNames = getValues()[visibleFieldName];

  return (
    <Draggable draggableId={fieldName} index={index} isDragDisabled={limitedProductionSite}>
      {provided => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <div className={css.fieldRow} key={fieldName}>
            <div className={indicatorColumnClasses}>
              <DragIndicator {...provided.dragHandleProps} isDragDisabled={limitedProductionSite} />
            </div>
            <div className={fieldNameClasses}>{renderFieldName(field)}</div>
            <div className={css.fieldColumn}>{i18n.t(`fields.${getLabelTypeField(field)}`)}</div>
            {renderColumn(SUBFORM_SORT_BY)}
            {renderColumn(SUBFORM_GROUP_BY)}
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
};

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
