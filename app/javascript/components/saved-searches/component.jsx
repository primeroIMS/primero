import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles, Typography, Box } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useI18n } from "components/i18n";
import { fetchSavedSearches } from "./action-creators";
import SavedSearchesForm from "./SavedSearchesForm";
import ListSavedSearches from "./ListSavedSearches";
import { selectSavedSearches } from "./selectors";
import styles from "./styles.css";

const SavedSearches = ({ recordType }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSavedSearches());
  }, [dispatch]);

  const savedSearches = useSelector(state =>
    selectSavedSearches(state, recordType)
  );

  const listSavedSearchesProps = {
    savedSearches
  };

  const formSavedSearchesProps = {
    recordType
  };

  return (
    <>
      <SavedSearchesForm {...formSavedSearchesProps} />
      {savedSearches.size ? (
        <ListSavedSearches {...listSavedSearchesProps} />
      ) : (
        <Box className={css.listSavedSearches} textAlign="center">
          <Typography variant="h6">
            {i18n.t("saved_search.not_found")}
          </Typography>
        </Box>
      )}
    </>
  );
};

SavedSearches.propTypes = {
  recordType: PropTypes.string
};

export default SavedSearches;
