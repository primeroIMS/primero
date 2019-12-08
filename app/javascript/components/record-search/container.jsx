import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { IconButton, InputBase, InputAdornment } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";

import { useI18n } from "../i18n";
import { getFiltersValuesByRecordType, applyFilters } from "../index-filters";

import { NAME } from "./constants";
import styles from "./styles.css";

const RecordSearch = ({ recordType, setFilters }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const dispatch = useDispatch();
  const filters = useSelector(state =>
    getFiltersValuesByRecordType(state, recordType)
  );
  const query = null;
  const [filterQuery, setFilterQuery] = useState(query || "");

  useEffect(() => {
    setFilterQuery(query || "");
  }, [query]);

  const updateFilters = () => {
    dispatch(
      applyFilters({
        recordType,
        data: { query: filterQuery, id_search: true, ...filters.toJS() }
      })
    );
  };

  useEffect(() => {
    // if (filterQuery === "") {
    //   updateFilters();
    // }
  }, [filterQuery]);

  const change = e => {
    setFilterQuery(e.target.value);
  };

  const keyUp = e => {
    if (e.keyCode === 13) {
      updateFilters();
    }
  };

  const clear = () => setFilterQuery("");

  return (
    <div className={css.root}>
      <div className={css.searchInput}>
        <IconButton
          className={css.iconButton}
          aria-label="menu"
          onClick={updateFilters}
        >
          <SearchIcon />
        </IconButton>
        <InputBase
          id="search-input"
          className={css.input}
          placeholder={i18n.t("navigation.search")}
          onKeyUp={keyUp}
          onChange={change}
          value={filterQuery}
          inputProps={{ "aria-label": i18n.t("navigation.search") }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton className={css.iconButton} onClick={clear}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </div>
    </div>
  );
};

RecordSearch.propTypes = {
  recordType: PropTypes.string.isRequired,
  setFilters: PropTypes.func.isRequired
};

RecordSearch.displayName = NAME;

export default RecordSearch;
