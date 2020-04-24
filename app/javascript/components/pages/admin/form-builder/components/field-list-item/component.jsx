import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Draggable } from "react-beautiful-dnd";
import { makeStyles } from "@material-ui/core";
import {
  createMuiTheme,
  MuiThemeProvider,
  useTheme
} from "@material-ui/core/styles";
import VpnKeyIcon from "@material-ui/icons/VpnKey";

import { useI18n } from "../../../../../i18n";
import SwitchInput from "../../../../../form/fields/switch-input";
import DragIndicator from "../../../forms-list/components/drag-indicator";
import styles from "../fields-list/styles.css";

import { NAME } from "./constants";

const Component = ({ field, index }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const currentTheme = useTheme();

  const themeOverrides = createMuiTheme({
    ...currentTheme,
    overrides: {
      ...currentTheme.overrides,
      MuiFormControl: {
        ...currentTheme.overrides.MuiFormControl,
        root: {
          ...currentTheme.overrides.MuiFormControl.root,
          marginBottom: 0
        }
      },
      MuiCheckbox: {
        ...currentTheme.overrides.MuiCheckbox,
        root: {
          ...currentTheme.overrides.MuiCheckbox.root,
          padding: "0 0.2em",
          margin: "0 0.4em"
        }
      },
      MuiFormControlLabel: {
        root: {
          ...currentTheme.overrides.MuiFormControlLabel.root,
          marginLeft: 0,
          marginRight: 0
        }
      }
    }
  });

  return (
    <Draggable draggableId={field.get("name")} index={index}>
      {provided => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <div className={css.fieldRow} key={field.get("name")}>
            <div className={clsx([css.fieldColumn, css.dragIndicatorColumn])}>
              <DragIndicator {...provided.dragHandleProps} />
            </div>
            <div className={clsx([css.fieldColumn, css.fieldName])}>
              {!field.get("editable") ? (
                <VpnKeyIcon className={css.rotateIcon} />
              ) : (
                <span />
              )}
              {field.getIn(["display_name", i18n.locale])}
            </div>
            <div className={css.fieldColumn}>
              {i18n.t(`fields.${field.get("type")}`)}
            </div>
            <div className={clsx([css.fieldColumn, css.fieldShow])}>
              <MuiThemeProvider theme={themeOverrides}>
                <SwitchInput
                  commonInputProps={{
                    name: `fields.${field.get("name")}.visible`,
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
  index: PropTypes.number.isRequired
};

export default Component;
