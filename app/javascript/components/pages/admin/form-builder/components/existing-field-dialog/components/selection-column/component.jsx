// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { NAME } from "./constants";

function Component({ addField, field, removeField, selected = false }) {
  const onAdd = () => {
    addField(field);
  };

  const onRemove = () => {
    removeField(field);
  };

  return selected ? (
    <IconButton size="large" onClick={onRemove} data-testid="remove-button">
      <RemoveIcon />
    </IconButton>
  ) : (
    <IconButton size="large" onClick={onAdd} data-testid="add-button">
      <AddIcon />
    </IconButton>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  addField: PropTypes.func.isRequired,
  field: PropTypes.object.isRequired,
  removeField: PropTypes.func.isRequired,
  selected: PropTypes.bool
};

export default Component;
