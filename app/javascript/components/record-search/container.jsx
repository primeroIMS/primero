import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { useI18n } from "components/i18n";
import { IconButton, InputBase } from "@material-ui/core";
import { selectFiltersByRecordType } from "components/filters-builder";
import SearchIcon from "@material-ui/icons/Search";
import styles from "./styles.css";

const RecordSearch = ({ recordType, setFilters }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const dispatch = useDispatch();
  const { query } = useSelector(state =>
    selectFiltersByRecordType(state, recordType)
  );
  const [filterQuery, setFilterQuery] = useState(query || "");

  useEffect(() => {
    setFilterQuery(query || "");
  }, [query]);

  const updateFilters = () => {
    dispatch(setFilters({ options: { query: filterQuery, id_search: true } }));
  };

  const change = e => {
    setFilterQuery(e.target.value);
  };

  const keyUp = e => {
    if (e.keyCode === 13) {
      updateFilters();
    }
  };

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
        />
      </div>
    </div>
  );
};

RecordSearch.propTypes = {
  recordType: PropTypes.string.isRequired,
  setFilters: PropTypes.func.isRequired
};

export default RecordSearch;
