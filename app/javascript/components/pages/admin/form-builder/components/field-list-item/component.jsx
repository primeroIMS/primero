/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
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
import { setSelectedField, setSelectedSubform } from "../../action-creators";
import { setDialog } from "../../../../../record-actions/action-creators";
import { useI18n } from "../../../../../i18n";
import SwitchInput from "../../../../../form/fields/switch-input";
import DragIndicator from "../../../forms-list/components/drag-indicator";
import { getFieldsAttribute, getFiedListItemTheme } from "../utils";
import styles from "../fields-list/styles.css";
import { ADMIN_FIELDS_DIALOG } from "../field-dialog/constants";

import { NAME } from "./constants";

const Component = ({ field, index, subformField }) => {
  const css = makeStyles(styles)();
  const dispatch = useDispatch();
  const i18n = useI18n();
  const currentTheme = useTheme();
  const { watch } = useFormContext();
  const isNested = Boolean(subformField?.size);
  const parentFieldName = subformField?.get("name", "");
  const fieldsAttribute = getFieldsAttribute(isNested);
  const subformSortBy = isNested
    ? watch(`${parentFieldName}.subform_sort_by`, "")
    : null;
  const subformGroupBy = isNested
    ? watch(`${parentFieldName}.subform_group_by`, "")
    : null;

  const themeOverrides = createMuiTheme(getFiedListItemTheme(currentTheme));

  const handleClick = fieldName => {
    if (isNested) {
      return;
    }

    batch(() => {
      dispatch(setDialog({ dialog: ADMIN_FIELDS_DIALOG, open: true }));
      dispatch(setSelectedField(fieldName));
      if (field?.get("type") === SUBFORM_SECTION) {
        dispatch(setSelectedSubform(field.get("subform_section_id")));
      }
    });
  };

  const renderFieldName = () => {
    const icon = !field.get("editable") ? (
      <VpnKeyIcon className={css.rotateIcon} />
    ) : (
      <span />
    );

    return (
      <>
        {icon}
        <Button
          className={clsx({ [css.editable]: field.get("editable") })}
          onClick={() => handleClick(field.get("name"))}
        >
          {field.getIn(["display_name", i18n.locale])}
        </Button>
      </>
    );
  };

  const renderSortColumn = () =>
    isNested ? (
      <div className={css.fieldColumn}>
        <Controller
          as={<Radio />}
          inputProps={{ value: field.get("name") }}
          checked={subformSortBy === field.get("name")}
          name={`${parentFieldName}.subform_sort_by`}
        />
      </div>
    ) : null;

  const renderGroupColumn = () =>
    isNested ? (
      <div className={css.fieldColumn}>
        <Controller
          as={<Radio />}
          inputProps={{ value: field.get("name") }}
          checked={subformGroupBy === field.get("name")}
          name={`${parentFieldName}.subform_group_by`}
        />
      </div>
    ) : null;

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
              {i18n.t(`fields.${field.get("type")}`)}
            </div>
            {renderSortColumn()}
            {renderGroupColumn()}
            <div className={clsx([css.fieldColumn, css.fieldShow])}>
              <MuiThemeProvider theme={themeOverrides}>
                <SwitchInput
                  commonInputProps={{
                    name: `${fieldsAttribute}.${field.get("name")}.visible`,
                    disabled: !field.get("editable")
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
