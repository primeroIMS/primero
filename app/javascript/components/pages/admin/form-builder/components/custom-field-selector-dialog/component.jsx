import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Radio,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Button,
  List,
  makeStyles
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import { fromJS } from "immutable";

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

import styles from "./styles.css";
import { NAME } from "./constants";

const fields = [
  [TEXT_FIELD, TextImg],
  [TEXT_AREA, TextAreaImg],
  [TICK_FIELD, TickboxImg],
  [DATE_FIELD, DateImg],
  [SEPARATOR, SeperatorImg],
  [NUMERIC_FIELD, NumericImg],
  [RADIO_FIELD, RadioImg]
];

const Component = ({ onOpen }) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const dispatch = useDispatch();
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const handleDialog = () => {
    if (open) {
      onOpen();
    }
    setOpen(!open);
  };

  const handleListItem = item => {
    setSelectedItem(item);
  };

  const isItemSelected = item => selectedItem === item;

  const handleSelected = () => {
    dispatch(
      setDialog({
        dialog: ADMIN_FIELDS_DIALOG,
        open: true,
        mode: fromJS({ isNew: true })
      })
    );
    dispatch(setNewField(NEW_FIELD, selectedItem));
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
      <Button
        fullWidth
        color="primary"
        variant="contained"
        disableElevation
        onClick={handleDialog}
        className={css.addCustomFieldButton}
      >
        <FormatListBulletedIcon />
        <span>{i18n.t("fields.add_custom_field")}</span>
      </Button>
      <ActionDialog
        dialogTitle={i18n.t("fields.create_field")}
        open={open}
        enabledSuccessButton={selectedItem !== ""}
        confirmButtonLabel={i18n.t("buttons.select")}
        successHandler={handleSelected}
        cancelHandler={handleDialog}
        confirmButtonProps={confirmButtonProps}
        cancelButtonProps={cancelButtonProps}
      >
        <List>
          {fields.map((field, index) => {
            const [name, Icon] = field;

            return (
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
            );
          })}
        </List>
      </ActionDialog>
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  onOpen: PropTypes.func.isRequired
};

export default Component;
