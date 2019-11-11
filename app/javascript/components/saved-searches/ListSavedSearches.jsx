import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  makeStyles
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

import { useI18n } from "../i18n";
import { ActionDialog } from "../action-dialog";
import { setTab } from "../filters/action-creators";

import { removeSavedSearch, setSavedSearch } from "./action-creators";
import { selectSavedSearchesById } from "./selectors";
import { buildFiltersState } from "./helpers";
import styles from "./styles.css";

const ListSavedSearches = ({ recordType, savedSearches, resetFilters }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const dispatch = useDispatch();
  const [selectedSavedSearch, setSelectedSavedSearch] = useState(null);
  const [open, setOpenDialog] = useState(false);
  const [deleteSavedSearch, setDeleteSavedSearch] = useState(null);

  const selectedSearch = useSelector(state =>
    selectSavedSearchesById(state, recordType, selectedSavedSearch).first()
  );

  useEffect(() => {
    if (selectedSavedSearch) {
      const { filters } = selectedSearch.toJS();

      resetFilters();
      dispatch(setSavedSearch(recordType, buildFiltersState(filters)));
      dispatch(setTab({ recordType, value: 0 }));
    }
  }, [dispatch, recordType, resetFilters, selectedSavedSearch, selectedSearch]);

  const handleApplyFilter = (_e, id) => {
    setSelectedSavedSearch(id);
  };

  const handleDeleteFilter = id => {
    setOpenDialog(true);
    setDeleteSavedSearch(id);
  };

  const alertDialogProps = {
    open,
    dialogTitle: i18n.t("saved_search.title_modal"),
    dialogText: i18n.t("saved_search.title_description"),
    confirmButtonLabel: i18n.t("yes_label"),
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
      <ActionDialog {...alertDialogProps} />
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
  recordType: PropTypes.string.isRequired,
  resetFilters: PropTypes.func,
  savedSearches: PropTypes.object.isRequired
};

export default ListSavedSearches;
