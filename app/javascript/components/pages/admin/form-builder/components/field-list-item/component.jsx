/* eslint-disable react/display-name, react/no-multi-comp */
import React from "react";
import { useDispatch, batch } from "react-redux";
import { Controller } from "react-hook-form";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Draggable } from "react-beautiful-dnd";
import { Button, makeStyles, Radio } from "@material-ui/core";
import { createMuiTheme, MuiThemeProvider, useTheme } from "@material-ui/core/styles";
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
import { getFieldsAttribute, getFiedListItemTheme, getLabelTypeField } from "../utils";
import styles from "../fields-list/styles.css";
import { ADMIN_FIELDS_DIALOG } from "../field-dialog/constants";
import { setInitialForms, toggleHideOnViewPage } from "../field-dialog/utils";
import { dataToJS, displayNameHelper } from "../../../../../../libs";

import { NAME, SUBFORM_GROUP_BY, SUBFORM_SECTION_CONFIGURATION, SUBFORM_SORT_BY } from "./constants";

const Component = ({ field, getValues, index, subformField, subformSortBy, subformGroupBy, limitedProductionSite }) => {
  const css = makeStyles(styles)();
  const dispatch = useDispatch();
  const i18n = useI18n();
  const currentTheme = useTheme();
  const isNested = Boolean(subformField?.toSeq()?.size);
  const parentFieldName = subformField?.get("name", "");
  const fieldsAttribute = getFieldsAttribute(isNested);
  const fieldName = field.get("name");
  const visibleFieldName = `${fieldsAttribute}.${fieldName}.visible`;

  const themeOverrides = createMuiTheme(getFiedListItemTheme(currentTheme));

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

    return (
      <>
        {icon}
        <Button
          className={clsx({ [css.editable]: !isNotEditable })}
          onClick={() => handleClick()}
          disabled={limitedProductionSite}
        >
          {displayNameHelper(dataToJS(field.get("display_name")), i18n.locale)}
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
            as={<Radio />}
            inputProps={{ value: fieldName }}
            checked={checked}
            name={`${parentFieldName}.${SUBFORM_SECTION_CONFIGURATION}.${column}`}
          />
        </div>
      )
    );
  };

  return (
    <Draggable draggableId={fieldName} index={index} isDragDisabled={limitedProductionSite}>
      {provided => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <div className={css.fieldRow} key={fieldName}>
            <div className={clsx([css.fieldColumn, css.dragIndicatorColumn])}>
              <DragIndicator {...provided.dragHandleProps} isDragDisabled={limitedProductionSite} />
            </div>
            <MuiThemeProvider theme={themeOverrides}>
              <div className={clsx([css.fieldColumn, css.fieldName])}>{renderFieldName(field)}</div>
              <div className={css.fieldColumn}>{i18n.t(`fields.${getLabelTypeField(field)}`)}</div>
              {renderColumn(SUBFORM_SORT_BY)}
              {renderColumn(SUBFORM_GROUP_BY)}
              <div className={clsx([css.fieldColumn, css.fieldShow])}>
                <SwitchInput
                  commonInputProps={{ name: visibleFieldName, disabled: isNotEditable }}
                  metaInputProps={{ selectedValue: getValues()[visibleFieldName] }}
                />
              </div>
            </MuiThemeProvider>
          </div>
        </div>
      )}
    </Draggable>
  );
};

Component.displayName = NAME;

Component.whyDidYouRender = true;

Component.propTypes = {
  field: PropTypes.object.isRequired,
  getValues: PropTypes.func,
  index: PropTypes.number.isRequired,
  limitedProductionSite: PropTypes.bool,
  subformField: PropTypes.object,
  subformGroupBy: PropTypes.string,
  subformSortBy: PropTypes.string
};

export default React.memo(Component);
