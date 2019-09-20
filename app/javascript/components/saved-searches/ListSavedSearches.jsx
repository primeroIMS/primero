/* eslint-disable no-console */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  makeStyles
} from "@material-ui/core";
import { useI18n } from "components/i18n";
import { AlertDialog } from "components/alert-dialog";
import DeleteIcon from "@material-ui/icons/Delete";
import { removeSavedSearch } from "./action-creators";
import styles from "./styles.css";

const ListSavedSearches = ({ savedSearches }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const dispatch = useDispatch();
  const [open, setOpenDialog] = useState(false);
  const [deleteSavedSearch, setDeleteSavedSearch] = useState(null);

  const handleApplyFilter = (_e, id) => {
    console.log(`Item list click ${id}`);
  };

  const handleDeleteFilter = id => {
    setOpenDialog(true);
    setDeleteSavedSearch(id);
  };

  const alertDialogProps = {
    open,
    title: i18n.t("saved_search.title_modal"),
    description: i18n.t("saved_search.title_description"),
    successHandler: () => {
      dispatch(
        removeSavedSearch(deleteSavedSearch, i18n.t("saved_search.deleted"))
      );
    },
    cancelHandler: () => {
      setOpenDialog(false);
      setDeleteSavedSearch(null);
    }
  };

  return (
    <div className={css.listSavedSearches}>
      <AlertDialog {...alertDialogProps} />
      <h3>{i18n.t("cases.my_filters")}</h3>
      <Divider light />
      <List component="nav">
        {savedSearches.valueSeq().map(savedSearch => (
          <ListItem
            button
            onClick={event => handleApplyFilter(event, savedSearch.id)}
            key={savedSearch.id}
          >
            <ListItemText primary={savedSearch.name} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => handleDeleteFilter(savedSearch.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

ListSavedSearches.propTypes = {
  savedSearches: PropTypes.object
};

export default ListSavedSearches;
