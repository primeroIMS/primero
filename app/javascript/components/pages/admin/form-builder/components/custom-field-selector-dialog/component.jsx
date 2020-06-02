import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Radio,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Button,
  List
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
import { FieldTypeDate } from "../../../../../../images/primero-icons";
import { useI18n } from "../../../../../i18n";

const fields = [
  [TEXT_FIELD, FieldTypeDate],
  [TEXT_AREA, FieldTypeDate],
  [TICK_FIELD, FieldTypeDate],
  [DATE_FIELD, FieldTypeDate],
  [SEPARATOR, FieldTypeDate],
  [NUMERIC_FIELD, FieldTypeDate],
  [RADIO_FIELD, FieldTypeDate]
];

const Component = ({ onOpen }) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(undefined);
  const dispatch = useDispatch();
  const i18n = useI18n();

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
                <ListItemText primary={i18n.t(`fields.${name}`)} />
                <ListItemText primary={<Icon />} />

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
