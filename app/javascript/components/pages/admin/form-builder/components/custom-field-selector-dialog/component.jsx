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
  SelectInput
} from "../../../../../../images/primero-icons";

import styles from "./styles.css";
import { NAME, CUSTOM_FIELD_SELECTOR_DIALOG } from "./constants";

const fields = [
  [TEXT_FIELD, TextInput],
  [TEXT_AREA, TextAreaInput],
  [TICK_FIELD, TickBoxInput],
  [DATE_FIELD, DateInput],
  [SEPARATOR, Seperator],
  [NUMERIC_FIELD, NumericInput],
  [RADIO_FIELD, RadioInput],
  [SELECT_FIELD, SelectInput]
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
          name: NEW_FIELD,
          type: selectedItem,
          visible: true,
          mobile_visible: true,
          hide_on_view_page: false
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
