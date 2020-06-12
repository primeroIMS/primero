import React, { useState, useEffect } from "react";
import {
  Radio,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  List,
  ListSubheader,
  Divider,
  makeStyles
} from "@material-ui/core";
import { useDispatch, useSelector, batch } from "react-redux";
import clsx from "clsx";

import ActionDialog from "../../../../../action-dialog";
import {
  TEXT_FIELD,
  TEXT_AREA,
  TICK_FIELD,
  DATE_FIELD,
  SEPARATOR,
  NUMERIC_FIELD,
  RADIO_FIELD,
  SELECT_FIELD
} from "../../../../../form";
import { setDialog } from "../../../../../record-actions/action-creators";
import { ADMIN_FIELDS_DIALOG } from "../field-dialog/constants";
import { useI18n } from "../../../../../i18n";
import { NEW_FIELD } from "../../constants";
import { setNewField } from "../../action-creators";
import { selectDialog } from "../../../../../record-actions/selectors";
import { CUSTOM_FIELD_DIALOG } from "../custom-field-dialog/constants";
import {
  DateInput,
  Seperator,
  TickBoxInput,
  TextAreaInput,
  TextInput,
  NumericInput,
  RadioInput,
  SelectInput,
  MultiSelectInput,
  DateTimeInput
} from "../../../../../../images/primero-icons";

import styles from "./styles.css";
import {
  CUSTOM_FIELD_SELECTOR_DIALOG,
  DATE_TIME_FIELD,
  NAME,
  MULTI_SELECT_FIELD
} from "./constants";

const fields = [
  [TEXT_FIELD, TextInput],
  [TEXT_AREA, TextAreaInput],
  [TICK_FIELD, TickBoxInput],
  [SELECT_FIELD, SelectInput],
  [RADIO_FIELD, RadioInput],
  [MULTI_SELECT_FIELD, MultiSelectInput],
  [NUMERIC_FIELD, NumericInput],
  [DATE_FIELD, DateInput],
  [DATE_TIME_FIELD, DateTimeInput],
  // [DATE_FIELD, DateRangeInput],
  [SEPARATOR, Seperator]
  // [SUBFORM_SECTION, SubformField]
];

const Component = () => {
  const [selectedItem, setSelectedItem] = useState("");
  const dispatch = useDispatch();
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const openFieldSelectorDialog = useSelector(state =>
    selectDialog(CUSTOM_FIELD_SELECTOR_DIALOG, state)
  );

  useEffect(() => {
    setSelectedItem("");
  }, [openFieldSelectorDialog]);

  const handleListItem = item => {
    setSelectedItem(item);
  };

  const isItemSelected = item => selectedItem === item;

  const handleSelected = () => {
    const newFieldAttributtes = {
      name: NEW_FIELD,
      type: selectedItem,
      visible: true,
      mobile_visible: true,
      hide_on_view_page: false
    };
    const multiSelectAttributtes = selectedItem === MULTI_SELECT_FIELD && {
      type: SELECT_FIELD,
      multi_select: true
    };
    const dateTimeAttributtes = selectedItem === DATE_TIME_FIELD && {
      type: DATE_FIELD,
      multi_select: true
    };

    batch(() => {
      dispatch(
        setDialog({
          dialog: CUSTOM_FIELD_SELECTOR_DIALOG,
          open: false
        })
      );
      dispatch(
        setDialog({
          dialog: ADMIN_FIELDS_DIALOG,
          open: true
        })
      );
      dispatch(
        setNewField({
          ...newFieldAttributtes,
          ...multiSelectAttributtes,
          ...dateTimeAttributtes
        })
      );
    });
  };

  const handleClose = () => {
    batch(() => {
      dispatch(
        setDialog({ dialog: CUSTOM_FIELD_SELECTOR_DIALOG, open: false })
      );
      if (selectedItem === "") {
        dispatch(setDialog({ dialog: CUSTOM_FIELD_DIALOG, open: true }));
      }
    });
  };

  const confirmButtonProps = {
    color: "primary",
    variant: "contained",
    autoFocus: true
  };
  const cancelButtonProps = {
    color: "primary",
    variant: "contained",
    className: css.cancelButton
  };

  return (
    <>
      <ActionDialog
        dialogTitle={i18n.t("fields.create_field")}
        open={openFieldSelectorDialog}
        enabledSuccessButton={selectedItem !== ""}
        confirmButtonLabel={i18n.t("buttons.select")}
        successHandler={handleSelected}
        cancelHandler={handleClose}
        confirmButtonProps={confirmButtonProps}
        cancelButtonProps={cancelButtonProps}
      >
        <List>
          <ListSubheader>
            <ListItemText className={css.listHeader}>
              {i18n.t("forms.type_label")}
            </ListItemText>
            <ListItemSecondaryAction className={css.listHeader}>
              {i18n.t("forms.select_label")}
            </ListItemSecondaryAction>
          </ListSubheader>
          <Divider />
          {fields.map(field => {
            const [name, Icon] = field;

            return (
              <>
                <ListItem
                  key={field}
                  selected={isItemSelected(name)}
                  onClick={() => handleListItem(name)}
                >
                  <ListItemText className={css.label}>
                    <div>{i18n.t(`fields.${name}`)}</div>
                    <div className={css.inputPreviewContainer}>
                      <Icon
                        className={clsx(css.inputIcon, {
                          [css.inputIconTickBox]: [
                            RADIO_FIELD,
                            TICK_FIELD
                          ].includes(name)
                        })}
                      />
                    </div>
                  </ListItemText>
                  <ListItemSecondaryAction>
                    <Radio
                      value={name}
                      checked={isItemSelected(name)}
                      onChange={() => handleListItem(name)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </>
            );
          })}
        </List>
      </ActionDialog>
    </>
  );
};

Component.displayName = NAME;

export default Component;
