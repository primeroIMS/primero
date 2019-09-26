import React from "react";
import PropTypes from "prop-types";
import { makeStyles, Typography, Box } from "@material-ui/core";
import { useSelector } from "react-redux";
import { useI18n } from "components/i18n";
import ListSavedSearches from "./ListSavedSearches";
import { selectSavedSearches } from "./selectors";
import styles from "./styles.css";

const SavedSearches = ({ recordType, resetFilters }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  const savedSearches = useSelector(state =>
    selectSavedSearches(state, recordType)
  );

  const listSavedSearchesProps = {
    recordType,
    savedSearches,
    resetFilters
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

SavedSearches.propTypes = {
  recordType: PropTypes.string.isRequired,
  resetFilters: PropTypes.func
};

export default SavedSearches;
