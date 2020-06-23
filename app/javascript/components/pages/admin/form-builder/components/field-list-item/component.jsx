/* eslint-disable react/display-name, react/no-multi-comp */
import React from "react";
import { useDispatch, batch } from "react-redux";
import { Controller, useFormContext } from "react-hook-form";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Draggable } from "react-beautiful-dnd";
import { Button, makeStyles, Radio } from "@material-ui/core";
import {
  createMuiTheme,
  MuiThemeProvider,
  useTheme
} from "@material-ui/core/styles";
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
import { setDialog } from "../../../../../record-actions/action-creators";
import { useI18n } from "../../../../../i18n";
import SwitchInput from "../../../../../form/fields/switch-input";
import DragIndicator from "../../../forms-list/components/drag-indicator";
import {
  getFieldsAttribute,
  getFiedListItemTheme,
  getLabelTypeField
} from "../utils";
import styles from "../fields-list/styles.css";
import { ADMIN_FIELDS_DIALOG } from "../field-dialog/constants";
import { setInitialForms, toggleHideOnViewPage } from "../field-dialog/utils";

import { NAME, SUBFORM_GROUP_BY, SUBFORM_SORT_BY } from "./constants";

const Component = ({ field, index, subformField }) => {
  const css = makeStyles(styles)();
  const dispatch = useDispatch();
  const i18n = useI18n();
  const currentTheme = useTheme();
  const { watch, getValues } = useFormContext();
  const isNested = Boolean(subformField?.toSeq()?.size);
  const parentFieldName = subformField?.get("name", "");
  const fieldsAttribute = getFieldsAttribute(isNested);
  const subformSortBy = isNested
    ? watch(`${parentFieldName}.${SUBFORM_SORT_BY}`, "")
    : null;
  const subformGroupBy = isNested
    ? watch(`${parentFieldName}.${SUBFORM_GROUP_BY}`, "")
    : null;

  const themeOverrides = createMuiTheme(getFiedListItemTheme(currentTheme));

  const onNested = fieldName => {
    dispatch(clearSelectedSubformField());
    const currentFormData = getValues({ nest: true });
    const subformData = setInitialForms(currentFormData.subform_section);

    if (subformData) {
      dispatch(updateSelectedSubform(subformData));
      dispatch(
        updateSelectedField({
          [parentFieldName]: toggleHideOnViewPage(
            currentFormData[parentFieldName]
          )
        })
      );
    }
    dispatch(setSelectedSubformField(fieldName));
  };

  const handleClick = fieldName => {
    batch(() => {
      dispatch(setDialog({ dialog: ADMIN_FIELDS_DIALOG, open: true }));
      if (isNested) {
        onNested(fieldName);
      } else {
        dispatch(clearSelectedField());
        dispatch(setSelectedField(fieldName));
      }

      if (field?.get("type") === SUBFORM_SECTION) {
        dispatch(setSelectedSubform(field.get("subform_section_id")));
      }
    });
  };

  const isNotEditable = field.get("editable") === false;

  const renderFieldName = () => {
    const icon = isNotEditable ? (
      <VpnKeyIcon className={css.rotateIcon} />
    ) : (
      <span />
    );

    return (
      <>
        {icon}
        <Button
          className={clsx({ [css.editable]: !isNotEditable })}
          onClick={() => handleClick(field.get("name"))}
        >
          {field.getIn(["display_name", i18n.locale])}
        </Button>
      </>
    );
  };

  const renderColumn = column => {
    const checked =
      (SUBFORM_SORT_BY === column && subformSortBy === field.get("name")) ||
      (SUBFORM_GROUP_BY === column && subformGroupBy === field.get("name"));

    return (
      isNested && (
        <div className={css.fieldColumn}>
          <Controller
            as={<Radio />}
            inputProps={{ value: field.get("name") }}
            checked={checked}
            name={`${parentFieldName}.${column}`}
          />
        </div>
      )
    );
  };

  return (
    <Draggable draggableId={field.get("name")} index={index}>
      {provided => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <div className={css.fieldRow} key={field.get("name")}>
            <div className={clsx([css.fieldColumn, css.dragIndicatorColumn])}>
              <DragIndicator {...provided.dragHandleProps} />
            </div>
            <div className={clsx([css.fieldColumn, css.fieldName])}>
              {renderFieldName(field)}
            </div>
            <div className={css.fieldColumn}>
              {i18n.t(`fields.${getLabelTypeField(field)}`)}
            </div>
            {renderColumn(SUBFORM_SORT_BY)}
            {renderColumn(SUBFORM_GROUP_BY)}
            <div className={clsx([css.fieldColumn, css.fieldShow])}>
              <MuiThemeProvider theme={themeOverrides}>
                <SwitchInput
                  commonInputProps={{
                    name: `${fieldsAttribute}.${field.get("name")}.visible`,
                    disabled: isNotEditable
                  }}
                />
              </MuiThemeProvider>
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
  index: PropTypes.number.isRequired,
  subformField: PropTypes.object
};

export default Component;
