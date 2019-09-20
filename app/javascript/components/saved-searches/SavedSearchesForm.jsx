import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { selectFiltersByRecordType } from "components/filters-builder/selectors";
import { makeStyles } from "@material-ui/styles";
import { Paper, InputBase, IconButton } from "@material-ui/core";
import Save from "@material-ui/icons/Save";
import styles from "./styles.css";

const SavedSearchesForm = ({ recordType }) => {
  const css = makeStyles(styles)();
  const excludeDefaultFiltersKeys = ["short", "per", "page"];

  const selectedFilters = useSelector(state =>
    selectFiltersByRecordType(state, recordType)
  );

  const buildFilters = filters => {
    return filters.reduce((obj, filter) => {
      const o = obj;
      const [key, value] = filter;
      if (!excludeDefaultFiltersKeys.includes(key)) {
        const isArrayWithData = Array.isArray(value) && value.length > 0;
        const isObjectWithData =
          !Array.isArray(value) &&
          typeof value === "object" &&
          !Object.values(value).includes(null);

        if (isArrayWithData || isObjectWithData) {
          o[key] = value;
        }
      }
      return o;
    }, {});
  };

  const handleSavedSearches = () => {
    // TODO: Get all applied filters according to <recordType>
    // and make request to save, also clear form
    if (selectedFilters) {
      const data = buildFilters(Object.entries(selectedFilters.toJS()));
      if (Object.keys(data).length > 0) {
        console.log("TODO: Save saved Search", data);
        // Reset Filters
      } else {
        console.log("No filters selected");
      }
    }
  };

  return (
    <Paper className={css.searchesForm} elevation={0}>
      <InputBase
        placeholder="Name..."
        inputProps={{ "aria-label": "saved searches" }}
      />
      <IconButton aria-label="saved" onClick={handleSavedSearches}>
        <Save />
      </IconButton>
    </Paper>
  );
};

SavedSearchesForm.propTypes = {
  recordType: PropTypes.string.isRequired
};

export default SavedSearchesForm;
