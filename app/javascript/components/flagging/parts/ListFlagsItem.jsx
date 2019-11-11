import React from "react";
import PropTypes from "prop-types";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

import { useI18n } from "../../i18n";

const ListFlagItem = ({ flag, handleDelete }) => {
  const i18n = useI18n();

  if (flag) {
    return (
      <ListItem>
        <ListItemText
          primary={flag.message}
          secondary={`${i18n.l("date.formats.default", flag.date)} / ${
            flag.flagged_by
          }`}
        />
        {handleDelete && (
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleDelete(flag.id)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItem>
    );
  }

  return null;
};

ListFlagItem.propTypes = {
  flag: PropTypes.object.isRequired,
  handleDelete: PropTypes.func
};

export default ListFlagItem;
