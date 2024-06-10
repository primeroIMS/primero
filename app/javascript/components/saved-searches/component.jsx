// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Typography } from "@mui/material";

import { useI18n } from "../i18n";
import useMemoizedSelector from "../../libs/use-memoized-selector";

import ListSavedSearches from "./ListSavedSearches";
import { selectSavedSearches } from "./selectors";
import css from "./styles.css";

const SavedSearches = ({ recordType, setTabIndex, setRerender }) => {
  const i18n = useI18n();

  const savedSearches = useMemoizedSelector(state => selectSavedSearches(state, recordType));

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
        <div className={css.listSavedSearches}>
          <Typography>{i18n.t("saved_searches.no_save_searches")}</Typography>
        </div>
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
