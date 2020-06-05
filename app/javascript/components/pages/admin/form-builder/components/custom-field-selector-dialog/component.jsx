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

import ActionDialog from "../../../../../action-dialog";
import {
  TEXT_FIELD,
  TEXT_AREA,
  TICK_FIELD,
  DATE_FIELD,
  SEPARATOR,
  NUMERIC_FIELD,
  RADIO_FIELD
} from "../../../../../form";
import { setDialog } from "../../../../../record-actions/action-creators";
import { ADMIN_FIELDS_DIALOG } from "../field-dialog/constants";
import { useI18n } from "../../../../../i18n";
import RadioImg from "../../../../../../images/field-types/radio.png";
import DateImg from "../../../../../../images/field-types/date.png";
import TextImg from "../../../../../../images/field-types/line.png";
import TextAreaImg from "../../../../../../images/field-types/textarea.png";
import TickboxImg from "../../../../../../images/field-types/tickbox.png";
import SeperatorImg from "../../../../../../images/field-types/seperator.png";
import NumericImg from "../../../../../../images/field-types/numeric.png";
import { NEW_FIELD } from "../../constants";
import { setNewField } from "../../action-creators";
import { selectDialog } from "../../../../../record-actions/selectors";
import { CUSTOM_FIELD_DIALOG } from "../custom-field-dialog/constants";

import styles from "./styles.css";
import { NAME, CUSTOM_FIELD_SELECTOR_DIALOG } from "./constants";

const fields = [
  [TEXT_FIELD, TextImg],
  [TEXT_AREA, TextAreaImg],
  [TICK_FIELD, TickboxImg],
  [DATE_FIELD, DateImg],
  [SEPARATOR, SeperatorImg],
  [NUMERIC_FIELD, NumericImg],
  [RADIO_FIELD, RadioImg]
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
      dispatch(setNewField(NEW_FIELD, selectedItem));
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
          {fields.map((field, index) => {
            const [name, Icon] = field;

            return (
              <>
                <ListItem
                  key={field}
                  selected={isItemSelected(name)}
                  onClick={() => handleListItem(index)}
                >
                  <ListItemText className={css.label}>
                    <div>{i18n.t(`fields.${name}`)}</div>
                    <div className={css.inputPreviewContainer}>
                      <img src={Icon} alt={name} className={css.inputPreview} />
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
