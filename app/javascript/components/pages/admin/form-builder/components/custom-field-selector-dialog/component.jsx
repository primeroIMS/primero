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

import styles from "./styles.css";

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
  const [selectedItem, setSelectedItem] = useState(undefined);
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
    dispatch(setDialog({ dialog: ADMIN_FIELDS_DIALOG, open: true }));
  };

  return (
    <>
      <Button
        fullWidth
        color="primary"
        variant="contained"
        disableElevation
        onClick={handleDialog}
      >
        Create Custom Field
      </Button>
      <ActionDialog
        dialogTitle="Create Field" // TODO: I18n
        open={open}
        enabledSuccessButton={selectedItem !== undefined}
        confirmButtonLabel="Select" // TODO: I18n
        successHandler={handleSelected}
        cancelHandler={handleDialog}
      >
        <List>
          {fields.map((field, index) => {
            const [name, Icon] = field;

            return (
              <ListItem
                key={field}
                selected={isItemSelected(index)}
                onClick={() => handleListItem(index)}
              >
                <ListItemText
                  className={css.label}
                >
                  <div>{i18n.t(`fields.${name}`)}</div>
                  <div className={css.inputPreviewContainer}>
                    <img src={Icon} alt={name} className={css.inputPreview} />
                  </div>
                </ListItemText>
                <ListItemSecondaryAction>
                  <Radio
                    checked={isItemSelected(index)}
                    onChange={() => handleListItem(index)}
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

Component.displayName = "CustomFieldSelectorDialog";

Component.propTypes = {
  onOpen: PropTypes.func.isRequired
};

export default Component;
