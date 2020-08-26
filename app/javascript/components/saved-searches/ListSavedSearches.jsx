import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { List, ListItem, ListItemText, ListItemSecondaryAction, Divider, makeStyles } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { push } from "connected-react-router";
import qs from "qs";

import { useI18n } from "../i18n";
import ActionDialog from "../action-dialog";
import { ROUTES } from "../../config";
import ActionButton from "../action-button";
import { ACTION_BUTTON_TYPES } from "../action-button/constants";

import { removeSavedSearch } from "./action-creators";
import { selectSavedSearchesById } from "./selectors";
import { buildFiltersState } from "./utils";
import styles from "./styles.css";

const ListSavedSearches = ({ recordType, savedSearches, setTabIndex, setRerender }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const dispatch = useDispatch();
  const [selectedSavedSearch, setSelectedSavedSearch] = useState(null);
  const [open, setOpenDialog] = useState(false);
  const [deleteSavedSearch, setDeleteSavedSearch] = useState(null);

  const selectedSearch = useSelector(state => selectSavedSearchesById(state, recordType, selectedSavedSearch).first());

  useEffect(() => {
    if (selectedSavedSearch) {
      const { filters } = selectedSearch.toJS();
      const builtFilters = buildFiltersState(filters);

      setTabIndex(0);
      setRerender(true);

      dispatch(
        push({
          pathname: ROUTES[recordType],
          search: qs.stringify(builtFilters)
        })
      );
    }
  }, [selectedSavedSearch]);

  const handleApplyFilter = id => {
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
      dispatch(removeSavedSearch(deleteSavedSearch, i18n.t("saved_search.deleted")));
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
          <ListItem button onClick={() => handleApplyFilter(savedSearch.id)} key={savedSearch.id}>
            <ListItemText primary={savedSearch.name} />
            <ListItemSecondaryAction>
              <ActionButton
                icon={<DeleteIcon />}
                type={ACTION_BUTTON_TYPES.icon}
                rest={{
                  "aria-label": i18n.t("buttons.delete"),
                  edge: "end",
                  onClick: () => handleDeleteFilter(savedSearch.id)
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

ListSavedSearches.displayName = "ListSavedSearches";

ListSavedSearches.propTypes = {
  recordType: PropTypes.string.isRequired,
  savedSearches: PropTypes.object.isRequired,
  setRerender: PropTypes.func.isRequired,
  setTabIndex: PropTypes.func.isRequired
};

export default ListSavedSearches;
