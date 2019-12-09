import React from "react";
import PropTypes from "prop-types";
import { makeStyles, Typography, Box } from "@material-ui/core";
import { useSelector } from "react-redux";

import { useI18n } from "../i18n";

import ListSavedSearches from "./ListSavedSearches";
import { selectSavedSearches } from "./selectors";
import styles from "./styles.css";

const SavedSearches = ({ recordType, setTabIndex, setRerender }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  const savedSearches = useSelector(state =>
    selectSavedSearches(state, recordType)
  );

  const listSavedSearchesProps = {
    recordType,
    savedSearches,
    setTabIndex,
    setRerender
  };

  return (
    <>
      {savedSearches.size ? (
        <ListSavedSearches {...listSavedSearchesProps} />
      ) : (
        <Box className={css.listSavedSearches}>
          <Typography>{i18n.t("saved_searches.no_save_searches")}</Typography>
        </Box>
      )}
    </>
  );
};

SavedSearches.displayName = "SavedSearches";

SavedSearches.propTypes = {
  recordType: PropTypes.string.isRequired,
  setRerender: PropTypes.func.isRequired,
  setTabIndex: PropTypes.func.isRequired
};

export default SavedSearches;
