import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { useI18n } from "components/i18n";
import { IconButton, InputBase } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { Map } from "immutable";
import * as actions from "./action-creators";
import styles from "./styles.css";

const RecordSearch = ({ namespace, path, data, fetchRecords }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  const searchRecords = () => {
    fetchRecords({
      options: data.filters
        .merge(Map({ query: document.getElementById("search-input").value }))
        .toJS(),
      path,
      namespace
    });
  };

  const keyPress = e => {
    if (e.keyCode === 13) {
      searchRecords();
    }
  };

  return (
    <div className={css.root}>
      <div className={css.searchInput}>
        <IconButton
          className={css.iconButton}
          aria-label="menu"
          onClick={searchRecords}
        >
          <SearchIcon />
        </IconButton>
        <InputBase
          id="search-input"
          className={css.input}
          placeholder={i18n.t("navigation.search")}
          onKeyDown={keyPress}
          inputProps={{ "aria-label": i18n.t("navigation.search") }}
        />
      </div>
    </div>
  );
};

RecordSearch.propTypes = {
  namespace: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  fetchRecords: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  searchRecords: actions.searchRecords
};

export default connect(
  null,
  mapDispatchToProps
)(RecordSearch);
